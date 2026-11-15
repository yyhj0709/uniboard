
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';

async function getAuthenticatedUser(request: NextRequest) {
  const sessionToken = request.cookies.get('uniboard_session')?.value;

  if (!sessionToken) return null;

  const tokenHash = createHash('sha256')
    .update(sessionToken)
    .digest('hex');

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          isActive: true,
        },
      },
    },
  });

  if (
    !session ||
    session.expiresAt < new Date() ||
    !session.user ||
    !session.user.isActive
  ) {
    return null;
  }

  return session.user;
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

// 좋아요 상태 및 개수 조회
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const user = await getAuthenticatedUser(request);

    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const [likeCount, existingLike] = await Promise.all([
      prisma.like.count({
        where: { postId: id },
      }),
      user
        ? prisma.like.findUnique({
            where: {
              postId_userId: {
                postId: id,
                userId: user.id,
              },
            },
          })
        : Promise.resolve(null),
    ]);

    return NextResponse.json({
      likeCount,
      isLiked: Boolean(existingLike),
    });
  } catch (error) {
    console.error('좋아요 조회 오류:', error);

    return NextResponse.json(
      { message: '좋아요 정보를 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}

// 좋아요 등록 및 취소
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId: id,
            userId: user.id,
          },
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId: id,
          userId: user.id,
        },
      });
    }

    const likeCount = await prisma.like.count({
      where: { postId: id },
    });

    return NextResponse.json({
      likeCount,
      isLiked: !existingLike,
    });
  } catch (error) {
    console.error('좋아요 처리 오류:', error);

    return NextResponse.json(
      { message: '좋아요 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
