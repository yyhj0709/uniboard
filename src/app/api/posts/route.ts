
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

// 게시글 목록 조회
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      authorId: post.userId,
      isAnonymous: post.isAnonymous,
      anonymousNickname: post.nickname,
      viewCount: post.views,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      isHot: false,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      comments: [],
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error('게시글 조회 오류:', error);

    return NextResponse.json(
      { message: '게시글을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}

// 게시글 작성
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { category, title, content, isAnonymous, nickname } = body;

    const allowedCategories = ['FREE', 'SECRET', 'CAREER', 'INFO'];

    if (
      !allowedCategories.includes(category) ||
      typeof title !== 'string' ||
      typeof content !== 'string' ||
      !title.trim() ||
      !content.trim() ||
      title.length > 100 ||
      content.length > 10000 ||
      (isAnonymous !== undefined && typeof isAnonymous !== 'boolean')
    ) {
      return NextResponse.json(
        { message: '게시글 정보를 확인해 주세요.' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        category,
        title: title.trim(),
        content: content.trim(),
        isAnonymous: isAnonymous !== false,
        nickname:
          isAnonymous !== false && typeof nickname === 'string'
            ? nickname.trim().slice(0, 30) || null
            : null,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('게시글 작성 오류:', error);

    return NextResponse.json(
      { message: '게시글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
