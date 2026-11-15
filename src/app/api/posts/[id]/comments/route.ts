
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

// 댓글 목록 조회
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
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

    const comments = await prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        postId: true,
        userId: true,
        content: true,
        isAnonymous: true,
        nickname: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('댓글 조회 오류:', error);

    return NextResponse.json(
      { message: '댓글을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}

// 댓글 작성
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

    const body = await request.json();
    const { content, isAnonymous, nickname } = body;

    if (
      typeof content !== 'string' ||
      !content.trim() ||
      content.trim().length > 3000
    ) {
      return NextResponse.json(
        { message: '댓글은 1~3000자까지 작성할 수 있습니다.' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId: id,
        userId: user.id,
        content: content.trim(),
        isAnonymous: isAnonymous !== false,
        nickname:
          isAnonymous !== false && typeof nickname === 'string'
            ? nickname.trim().slice(0, 30) || null
            : null,
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('댓글 작성 오류:', error);

    return NextResponse.json(
      { message: '댓글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 댓글 수정
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
    const body = await request.json();
    const { commentId, content } = body;

    if (
      typeof commentId !== 'string' ||
      typeof content !== 'string' ||
      !content.trim() ||
      content.trim().length > 3000
    ) {
      return NextResponse.json(
        { message: '댓글은 1~3000자까지 작성할 수 있습니다.' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.postId !== id) {
      return NextResponse.json(
        { message: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (comment.userId !== user.id) {
      return NextResponse.json(
        { message: '본인이 작성한 댓글만 수정할 수 있습니다.' },
        { status: 403 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
    });

    return NextResponse.json({
      message: '댓글이 수정되었습니다.',
      comment: updatedComment,
    });
  } catch (error) {
    console.error('댓글 수정 오류:', error);

    return NextResponse.json(
      { message: '댓글 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 댓글 삭제
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
    const body = await request.json();
    const { commentId } = body;

    if (typeof commentId !== 'string') {
      return NextResponse.json(
        { message: '삭제할 댓글 정보가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.postId !== id) {
      return NextResponse.json(
        { message: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (comment.userId !== user.id) {
      return NextResponse.json(
        { message: '본인이 작성한 댓글만 삭제할 수 있습니다.' },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      message: '댓글이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);

    return NextResponse.json(
      { message: '댓글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
