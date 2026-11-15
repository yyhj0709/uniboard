
'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { formatRelativeTime } from '@/lib/format';
import styles from './post-detail.module.css';

const CATEGORY_NAMES: Record<string, string> = {
  FREE: '자유게시판',
  SECRET: '비밀고민',
  CAREER: '취업/진로',
  INFO: '캠퍼스 정보',
  MARKET: '장터',
};

interface PostData {
  id: string;
  title: string;
  content: string;
  category: string;
  userId: string;
  isAnonymous: boolean;
  nickname: string | null;
  views: number;
  createdAt: string;
}

interface CommentData {
  id: string;
  postId: string;
  userId: string;
  content: string;
  isAnonymous: boolean;
  nickname: string | null;
  createdAt: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [commentText, setCommentText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentEditError, setCommentEditError] = useState('');

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [postResponse, commentResponse, myPageResponse] =
          await Promise.all([
            fetch(`/api/posts/${postId}`, { cache: 'no-store' }),
            fetch(`/api/posts/${postId}/comments`, { cache: 'no-store' }),
            fetch('/api/mypage', { cache: 'no-store' }),
          ]);

        const postResult = await postResponse.json();
        const commentResult = await commentResponse.json();

        if (!postResponse.ok) {
          throw new Error(postResult.message || '게시글을 불러오지 못했습니다.');
        }

        if (!commentResponse.ok) {
          throw new Error(commentResult.message || '댓글을 불러오지 못했습니다.');
        }

        setPost(postResult.post);
        setComments(commentResult.comments || []);

        if (myPageResponse.ok) {
          const myPageResult = await myPageResponse.json();
          setCurrentUserId(myPageResult.user?.id || null);
        } else {
          setCurrentUserId(null);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '데이터를 불러오는 중 오류가 발생했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) fetchData();
  }, [postId]);

  useEffect(() => {
    let cancelled = false;

    async function fetchLikeStatus() {
      try {
        const response = await fetch(`/api/posts/${postId}/like`, {
          cache: 'no-store',
        });

        if (!response.ok) return;

        const result = await response.json();

        if (!cancelled) {
          setLikeCount(result.likeCount);
          setIsLiked(result.isLiked);
        }
      } catch (err) {
        console.error('좋아요 조회 오류:', err);
      }
    }

    if (postId) fetchLikeStatus();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const handleLike = async () => {
    if (isLikeLoading) return;

    try {
      setIsLikeLoading(true);

      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });

      const result = await response.json();

      if (response.status === 401) {
        alert('좋아요를 누르려면 로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || '좋아요 처리에 실패했습니다.');
      }

      setLikeCount(result.likeCount);
      setIsLiked(result.isLiked);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : '좋아요 처리 중 오류가 발생했습니다.'
      );
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleAddComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUserId) {
      router.push('/login');
      return;
    }

    if (!commentText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setCommentError('');

      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentText.trim(),
          isAnonymous,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        alert('댓글을 작성하려면 로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || '댓글 작성에 실패했습니다.');
      }

      setCommentText('');

      const commentsResponse = await fetch(
        `/api/posts/${postId}/comments`,
        { cache: 'no-store' }
      );
      const commentsResult = await commentsResponse.json();

      if (commentsResponse.ok) {
        setComments(commentsResult.comments || []);
      }
    } catch (err) {
      setCommentError(
        err instanceof Error
          ? err.message
          : '댓글 작성 중 오류가 발생했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditComment = (comment: CommentData) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content);
    setCommentEditError('');
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
    setCommentEditError('');
  };

  const handleSaveEditComment = async (commentId: string) => {
    if (!editingCommentText.trim() || isEditingComment) return;

    try {
      setIsEditingComment(true);
      setCommentEditError('');

      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          content: editingCommentText.trim(),
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || '댓글 수정에 실패했습니다.');
      }

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: result.comment.content }
            : comment
        )
      );

      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (err) {
      setCommentEditError(
        err instanceof Error
          ? err.message
          : '댓글 수정 중 오류가 발생했습니다.'
      );
    } finally {
      setIsEditingComment(false);
    }
  };

  if (isLoading) {
    return <div className={styles.container}>게시글을 불러오는 중입니다.</div>;
  }

  if (error || !post) {
    return (
      <div className={styles.container}>
        <p>{error || '게시글을 찾을 수 없습니다.'}</p>
        <Link href="/community">커뮤니티로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button
          onClick={() => router.push('/community')}
          className={styles.backBtn}
        >
          <span>← 목록으로 돌아가기</span>
        </button>
      </div>

      <article className={styles.article}>
        <header className={styles.postHeader}>
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge}>
              {CATEGORY_NAMES[post.category] || post.category}
            </span>
            <span className={styles.dot}>•</span>
            <span className={styles.author}>
              {post.isAnonymous ? post.nickname || '익명' : '학우'}
            </span>
            <span className={styles.dot}>•</span>
            <time className={styles.time}>
              {formatRelativeTime(new Date(post.createdAt))}
            </time>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
        </header>

        <div className={styles.body}>
          {post.content.split('\n').map((line, idx) => (
            <p key={idx} className={styles.paragraph}>
              {line || '\u00A0'}
            </p>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '24px 0',
            borderTop: '1px solid #eee',
            marginTop: '20px',
          }}
        >
          <button
            type="button"
            onClick={handleLike}
            disabled={isLikeLoading}
            aria-label={isLiked ? '좋아요 취소' : '좋아요'}
            aria-pressed={isLiked}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              border: `1px solid ${isLiked ? '#e74c3c' : '#ddd'}`,
              borderRadius: '24px',
              background: isLiked ? '#fff1f0' : '#fff',
              color: isLiked ? '#e74c3c' : '#666',
              cursor: isLikeLoading ? 'wait' : 'pointer',
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            좋아요 {likeCount}
          </button>
        </div>
      </article>

      <section className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>
          댓글 <span>{comments.length}</span>
        </h2>

        {currentUserId ? (
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <textarea
              placeholder="캠퍼스 동료에게 따뜻한 댓글을 남겨주세요."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={styles.commentInput}
              rows={3}
              maxLength={3000}
            />

            <div className={styles.commentFormBottom}>
              <label className={styles.anonLabel}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span>익명으로 작성</span>
              </label>

              <button
                type="submit"
                className={styles.commentSubmitBtn}
                disabled={!commentText.trim() || isSubmitting}
              >
                {isSubmitting ? '등록 중...' : '등록'}
              </button>
            </div>

            {commentError && <p>{commentError}</p>}
          </form>
        ) : (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              background: '#f9fafb',
              marginBottom: '24px',
            }}
          >
            <p style={{ marginBottom: '14px', color: '#555' }}>
              댓글을 작성하려면 로그인이 필요합니다.
            </p>
            <button
              type="button"
              onClick={() => router.push('/login')}
              style={{
                padding: '10px 22px',
                border: 'none',
                borderRadius: '8px',
                background: '#2563eb',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              로그인하기
            </button>
          </div>
        )}

        <div className={styles.commentList}>
          {comments.length === 0 ? (
            <p className={styles.emptyDesc}>아직 댓글이 없습니다.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={styles.commentItem}>
                <div className={styles.commentItemHeader}>
                  <span className={styles.commentAuthor}>
                    {comment.isAnonymous ? comment.nickname || '익명' : '학우'}
                  </span>

                  <time className={styles.commentTime}>
                    {formatRelativeTime(new Date(comment.createdAt))}
                  </time>
                </div>

                {editingCommentId === comment.id ? (
                  <div>
                    <textarea
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      maxLength={3000}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        resize: 'vertical',
                        fontSize: '14px',
                      }}
                    />

                    {commentEditError && (
                      <p style={{ color: '#e74c3c', fontSize: '13px' }}>
                        {commentEditError}
                      </p>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px',
                        marginTop: '8px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleCancelEditComment}
                        disabled={isEditingComment}
                        style={{
                          padding: '7px 13px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          background: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        취소
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveEditComment(comment.id)}
                        disabled={!editingCommentText.trim() || isEditingComment}
                        style={{
                          padding: '7px 13px',
                          border: 'none',
                          borderRadius: '6px',
                          background: '#2563eb',
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        {isEditingComment ? '저장 중...' : '저장'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={styles.commentContent}>{comment.content}</p>

                    {currentUserId === comment.userId && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginTop: '8px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleStartEditComment(comment)}
                          style={{
                            padding: '5px 10px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            background: '#fff',
                            color: '#555',
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
