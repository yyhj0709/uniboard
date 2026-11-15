
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('uniboard_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const tokenHash = createHash('sha256')
      .update(sessionToken)
      .digest('hex');

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

    if (
      !session ||
      session.expiresAt < new Date() ||
      !session.user ||
      !session.user.isActive
    ) {
      return NextResponse.json(
        { message: '유효하지 않은 로그인입니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const [posts, comments] = await Promise.all([
      prisma.post.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
      prisma.comment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      user: {
        id: session.user.id,
        username: session.user.username,
      },
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        isAnonymous: post.isAnonymous,
        nickname: post.nickname,
        viewCount: post.views,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        createdAt: post.createdAt,
      })),
      comments: comments.map((comment) => ({
        id: comment.id,
        postId: comment.postId,
        content: comment.content,
        isAnonymous: comment.isAnonymous,
        nickname: comment.nickname,
        createdAt: comment.createdAt,
        post: comment.post,
      })),
    });
  } catch (error) {
    console.error('마이페이지 조회 오류:', error);

    return NextResponse.json(
      { message: '마이페이지 정보를 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}
