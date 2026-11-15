
import { NextResponse } from 'next/server';
import argon2 from 'argon2';
import { randomBytes, createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7일

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username =
      typeof body.username === 'string'
        ? body.username.trim().toLowerCase()
        : '';

    const password =
      typeof body.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json(
        { message: '아이디와 비밀번호를 입력해 주세요.' },
        { status: 400 }
      );
    }

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 검증
    const passwordMatches = await argon2.verify(
      user.passwordHash,
      password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 기존 세션 정리
    await prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    // 새 세션 토큰 생성
    const sessionToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256')
      .update(sessionToken)
      .digest('hex');

    const expiresAt = new Date(Date.now() + SESSION_DURATION);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // 로그인 쿠키 발급
    const response = NextResponse.json(
      {
        message: '로그인되었습니다.',
        user: { id: user.id, username: user.username },
      },
      { status: 200 }
    );

    response.cookies.set('uniboard_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error('로그인 오류:', error);

    return NextResponse.json(
      { message: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
