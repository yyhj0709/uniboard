import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('uniboard_session')?.value;

    if (!sessionToken || typeof sessionToken !== 'string' || sessionToken.trim() === '') {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const tokenHash = createHash('sha256')
      .update(sessionToken)
      .digest('hex');

    // 세션 및 연결된 사용자 정보 조회 (passwordHash 등 민감 정보 제외)
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            isActive: true,
          },
        },
      },
    });

    // 세션이 존재하지 않는 경우
    if (!session) {
      const response = NextResponse.json(
        { message: '유효하지 않은 세션입니다.' },
        { status: 401 }
      );

      response.cookies.set('uniboard_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });

      return response;
    }

    // 세션 만료 여부 확인
    if (session.expiresAt < new Date()) {
      // 만료된 세션 DB에서 삭제
      await prisma.session.deleteMany({
        where: { tokenHash },
      });

      const response = NextResponse.json(
        { message: '세션이 만료되었습니다. 다시 로그인해 주세요.' },
        { status: 401 }
      );

      response.cookies.set('uniboard_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });

      return response;
    }

    // 연결된 사용자의 활성화 상태(isActive) 확인
    if (!session.user || !session.user.isActive) {
      // 비활성화되었거나 유효하지 않은 사용자 세션 정리
      await prisma.session.deleteMany({
        where: { tokenHash },
      });

      const response = NextResponse.json(
        { message: '비활성화되었거나 유효하지 않은 계정입니다.' },
        { status: 401 }
      );

      response.cookies.set('uniboard_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });

      return response;
    }

    // 유효한 로그인 상태: 사용자 ID와 username 반환
    return NextResponse.json(
      {
        user: {
          id: session.user.id,
          username: session.user.username,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('로그인 상태 확인 오류:', error);

    return NextResponse.json(
      { message: '로그인 상태 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
