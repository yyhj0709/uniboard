
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type MyPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  nickname: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
};

type MyComment = {
  id: string;
  postId: string;
  content: string;
  isAnonymous: boolean;
  nickname: string | null;
  createdAt: string;
  post: {
    id: string;
    title: string;
    category: string;
  };
};

type MyPageData = {
  user: {
    id: string;
    username: string;
  };
  posts: MyPost[];
  comments: MyComment[];
};

export default function MyPage() {
  const [data, setData] = useState<MyPageData | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  useEffect(() => {
    async function loadMyPage() {
      try {
        const response = await fetch('/api/mypage', {
          cache: 'no-store',
        });

        if (response.status === 401) {
          setError('로그인이 필요합니다.');
          return;
        }

        if (!response.ok) {
          throw new Error('마이페이지 정보를 불러오지 못했습니다.');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadMyPage();
  }, []);

  const handleStartEdit = (post: MyPost) => {
    setEditingPostId(post.id);
    setEditingTitle(post.title);
    setEditingContent(post.content);
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingTitle('');
    setEditingContent('');
    setEditError('');
  };

  const handleSaveEdit = async (postId: string) => {
    if (!editingTitle.trim() || !editingContent.trim()) {
      setEditError('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    if (editingTitle.trim().length > 100) {
      setEditError('제목은 100자까지 작성할 수 있습니다.');
      return;
    }

    if (editingContent.trim().length > 10000) {
      setEditError('내용은 10000자까지 작성할 수 있습니다.');
      return;
    }

    try {
      setIsSaving(true);
      setEditError('');

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingTitle.trim(),
          content: editingContent.trim(),
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        alert('로그인이 필요합니다.');
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || '게시글 수정에 실패했습니다.');
      }

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          posts: prev.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  title: result.post.title,
                  content: result.post.content,
                }
              : post
          ),
        };
      });

      handleCancelEdit();
      alert('게시글이 수정되었습니다.');
    } catch (err) {
      setEditError(
        err instanceof Error
          ? err.message
          : '게시글 수정 중 오류가 발생했습니다.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 게시글 삭제
  const handleDeletePost = async (postId: string) => {
    const confirmed = window.confirm(
      '정말 이 게시글을 삭제하시겠습니까?\n게시글에 달린 댓글도 함께 삭제됩니다.'
    );

    if (!confirmed) return;

    try {
      setDeletingItemId(`post-${postId}`);

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.status === 401) {
        alert('로그인이 필요합니다.');
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || '게시글 삭제에 실패했습니다.');
      }

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          posts: prev.posts.filter((post) => post.id !== postId),
          comments: prev.comments.filter(
            (comment) => comment.postId !== postId
          ),
        };
      });

      if (editingPostId === postId) {
        handleCancelEdit();
      }

      alert('게시글이 삭제되었습니다.');
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : '게시글 삭제 중 오류가 발생했습니다.'
      );
    } finally {
      setDeletingItemId(null);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (comment: MyComment) => {
    const confirmed = window.confirm(
      '정말 이 댓글을 삭제하시겠습니까?'
    );

    if (!confirmed) return;

    try {
      setDeletingItemId(`comment-${comment.id}`);

      const response = await fetch(
        `/api/posts/${comment.postId}/comments`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commentId: comment.id,
          }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        alert('로그인이 필요합니다.');
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || '댓글 삭제에 실패했습니다.');
      }

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          comments: prev.comments.filter(
            (item) => item.id !== comment.id
          ),
          posts: prev.posts.map((post) =>
            post.id === comment.postId
              ? {
                  ...post,
                  commentCount: Math.max(0, post.commentCount - 1),
                }
              : post
          ),
        };
      });

      alert('댓글이 삭제되었습니다.');
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : '댓글 삭제 중 오류가 발생했습니다.'
      );
    } finally {
      setDeletingItemId(null);
    }
  };

  if (loading) {
    return (
      <main style={{ maxWidth: 800, margin: '60px auto', padding: 20 }}>
        불러오는 중...
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ maxWidth: 800, margin: '60px auto', padding: 20 }}>
        <h2>{error}</h2>
        <Link href="/login">로그인하러 가기</Link>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>
        마이페이지
      </h1>

      <p style={{ color: '#666', marginBottom: 28 }}>
        {data.user.username} 님
      </p>

      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #ddd',
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => setActiveTab('posts')}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderBottom:
              activeTab === 'posts'
                ? '2px solid #333'
                : '2px solid transparent',
            background: 'none',
            fontWeight: activeTab === 'posts' ? 700 : 400,
            cursor: 'pointer',
          }}
        >
          내가 쓴 글 ({data.posts.length})
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderBottom:
              activeTab === 'comments'
                ? '2px solid #333'
                : '2px solid transparent',
            background: 'none',
            fontWeight: activeTab === 'comments' ? 700 : 400,
            cursor: 'pointer',
          }}
        >
          내가 쓴 댓글 ({data.comments.length})
        </button>
      </div>

      {activeTab === 'posts' && (
        <section>
          {data.posts.length === 0 ? (
            <p
              style={{
                color: '#888',
                padding: 30,
                textAlign: 'center',
              }}
            >
              작성한 게시글이 없습니다.
            </p>
          ) : (
            data.posts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: '18px 4px',
                  borderBottom: '1px solid #eee',
                }}
              >
                <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
                  {post.category} ·{' '}
                  {new Date(post.createdAt).toLocaleString('ko-KR')}
                </div>

                {editingPostId === post.id ? (
                  <div>
                    <input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      maxLength={100}
                      placeholder="게시글 제목"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: 12,
                        marginBottom: 10,
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        fontSize: 16,
                      }}
                    />

                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      maxLength={10000}
                      rows={8}
                      placeholder="게시글 내용"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: 12,
                        marginBottom: 10,
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        fontSize: 14,
                        resize: 'vertical',
                      }}
                    />

                    {editError && (
                      <p style={{ color: '#e74c3c', fontSize: 13 }}>
                        {editError}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(post.id)}
                        disabled={isSaving}
                        style={{
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: 6,
                          background: '#333',
                          color: '#fff',
                          cursor: isSaving ? 'wait' : 'pointer',
                        }}
                      >
                        {isSaving ? '저장 중...' : '저장'}
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        style={{
                          padding: '8px 16px',
                          border: '1px solid #ddd',
                          borderRadius: 6,
                          background: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/community/${post.id}`}
                      style={{
                        display: 'block',
                        color: 'inherit',
                        textDecoration: 'none',
                      }}
                    >
                      <h3 style={{ fontSize: 17, marginBottom: 8 }}>
                        {post.title}
                      </h3>

                      <p
                        style={{
                          color: '#666',
                          fontSize: 14,
                          marginBottom: 10,
                        }}
                      >
                        {post.content.length > 100
                          ? `${post.content.slice(0, 100)}...`
                          : post.content}
                      </p>

                      <div style={{ fontSize: 13, color: '#888' }}>
                        조회 {post.viewCount} · 좋아요 {post.likeCount} · 댓글{' '}
                        {post.commentCount}
                      </div>
                    </Link>

                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(post)}
                        style={{
                          padding: '7px 14px',
                          border: '1px solid #ddd',
                          borderRadius: 6,
                          background: '#fff',
                          color: '#555',
                          cursor: 'pointer',
                        }}
                      >
                        수정
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletingItemId === `post-${post.id}`}
                        style={{
                          padding: '7px 14px',
                          border: '1px solid #e5b8b8',
                          borderRadius: 6,
                          background: '#fff',
                          color: '#d33',
                          cursor: 'pointer',
                        }}
                      >
                        {deletingItemId === `post-${post.id}`
                          ? '삭제 중...'
                          : '삭제'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </section>
      )}

      {activeTab === 'comments' && (
        <section>
          {data.comments.length === 0 ? (
            <p
              style={{
                color: '#888',
                padding: 30,
                textAlign: 'center',
              }}
            >
              작성한 댓글이 없습니다.
            </p>
          ) : (
            data.comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  padding: '18px 4px',
                  borderBottom: '1px solid #eee',
                }}
              >
                <Link
                  href={`/community/${comment.postId}`}
                  style={{
                    display: 'block',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
                    게시글: {comment.post.title}
                  </div>

                  <p style={{ fontSize: 15, marginBottom: 8 }}>
                    {comment.content}
                  </p>

                  <div style={{ fontSize: 13, color: '#888' }}>
                    {new Date(comment.createdAt).toLocaleString('ko-KR')}
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => handleDeleteComment(comment)}
                  disabled={deletingItemId === `comment-${comment.id}`}
                  style={{
                    marginTop: 12,
                    padding: '7px 14px',
                    border: '1px solid #e5b8b8',
                    borderRadius: 6,
                    background: '#fff',
                    color: '#d33',
                    cursor: 'pointer',
                  }}
                >
                  {deletingItemId === `comment-${comment.id}`
                    ? '삭제 중...'
                    : '삭제'}
                </button>
              </div>
            ))
          )}
        </section>
      )}
    </main>
  );
}
