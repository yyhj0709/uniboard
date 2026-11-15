
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

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
    !session.user.isActive
  ) {
    return null;
  }

  return session.user;
}

// 게시글 조회
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        category: true,
        title: true,
        content: true,
        isAnonymous: true,
        nickname: true,
        views: true,
        createdAt: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);

    return NextResponse.json(
      { message: '게시글을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}

// 게시글 수정
export async function PATCH(
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
      select: { id: true, userId: true },
    });

    if (!post) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (post.userId !== user.id) {
      return NextResponse.json(
        { message: '본인이 작성한 게시글만 수정할 수 있습니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, category } = body;

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      title.trim().length > 100
    ) {
      return NextResponse.json(
        { message: '제목은 1~100자로 입력해 주세요.' },
        { status: 400 }
      );
    }

    if (
      typeof content !== 'string' ||
      !content.trim() ||
      content.trim().length > 10000
    ) {
      return NextResponse.json(
        { message: '내용은 1~10000자로 입력해 주세요.' },
        { status: 400 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title.trim(),
        content: content.trim(),
        ...(typeof category === 'string' ? { category } : {}),
      },
    });

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error('게시글 수정 오류:', error);

    return NextResponse.json(
      { message: '게시글 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 게시글 삭제
export async function DELETE(
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
      select: { id: true, userId: true },
    });

    if (!post) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (post.userId !== user.id) {
      return NextResponse.json(
        { message: '본인이 작성한 게시글만 삭제할 수 있습니다.' },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);

    return NextResponse.json(
      { message: '게시글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
