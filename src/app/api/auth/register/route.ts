
import { NextResponse } from 'next/server';
import argon2 from 'argon2';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username =
      typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
    const password =
      typeof body.password === 'string' ? body.password : '';

    // 아이디 검증
    if (!/^[a-z0-9_]{4,20}$/.test(username)) {
      return NextResponse.json(
        { message: '아이디는 영문 소문자, 숫자, 밑줄(_)로 4~20자여야 합니다.' },
        { status: 400 }
      );
    }

    // 비밀번호 검증
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { message: '비밀번호는 8~128자로 입력해 주세요.' },
        { status: 400 }
      );
    }

    // 중복 아이디 확인
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: '이미 사용 중인 아이디입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해싱
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    // 사용자 생성
    await prisma.user.create({
      data: {
        username,
        passwordHash,
      },
    });

    return NextResponse.json(
      { message: '회원가입이 완료되었습니다.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('회원가입 오류:', error);

    return NextResponse.json(
      { message: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
