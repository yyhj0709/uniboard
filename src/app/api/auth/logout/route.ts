import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('uniboard_session')?.value;

    if (sessionToken && typeof sessionToken === 'string' && sessionToken.trim() !== '') {
      const tokenHash = createHash('sha256')
        .update(sessionToken)
        .digest('hex');

      // 세션 삭제 (이미 삭제되었거나 존재하지 않아도 안전하게 처리)
      await prisma.session.deleteMany({
        where: { tokenHash },
      });
    }

    const response = NextResponse.json(
      { message: '로그아웃되었습니다.' },
      { status: 200 }
    );

    // uniboard_session 쿠키 만료 처리
    response.cookies.set('uniboard_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('로그아웃 오류:', error);

    return NextResponse.json(
      { message: '로그아웃 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
