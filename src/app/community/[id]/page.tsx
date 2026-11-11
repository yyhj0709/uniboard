'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_POSTS } from '@/mocks/posts';
import { formatRelativeTime } from '@/lib/format';
import { Comment } from '@/types';
import styles from './post-detail.module.css';

const CATEGORY_NAMES: Record<string, string> = {
  FREE: '자유게시판',
  SECRET: '비밀고민',
  CAREER: '취업/진로',
  INFO: '캠퍼스 정보',
  MARKET: '장터',
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const initialPost = MOCK_POSTS.find((p) => p.id === postId) || MOCK_POSTS[0];

  const [likes, setLikes] = useState(initialPost.likeCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialPost.comments);
  const [commentText, setCommentText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c-temp-${Date.now()}`,
      postId: initialPost.id,
      authorId: 'user-me',
      content: commentText.trim(),
      isAnonymous,
      anonymousIndex: comments.length + 1,
      createdAt: new Date(),
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText('');
  };

  return (
    <div className={styles.container}>
      {/* Back button */}
      <div className={styles.topBar}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span>목록으로 돌아가기</span>
        </button>
      </div>

      {/* Main Post Card */}
      <article className={styles.article}>
        <header className={styles.postHeader}>
          <div className={styles.metaRow}>
            <span className={styles.categoryBadge}>
              {CATEGORY_NAMES[initialPost.category] || initialPost.category}
            </span>
            <span className={styles.dot}>•</span>
            <span className={styles.author}>{initialPost.anonymousNickname || '익명'}</span>
            <span className={styles.dot}>•</span>
            <time className={styles.time}>{formatRelativeTime(initialPost.createdAt)}</time>
          </div>
          <h1 className={styles.title}>{initialPost.title}</h1>
        </header>

        {/* Content Body */}
        <div className={styles.body}>
          {initialPost.content.split('\n').map((line, idx) => (
            <p key={idx} className={styles.paragraph}>
              {line || <br />}
            </p>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            onClick={handleLike}
            className={`${styles.likeBtn} ${hasLiked ? styles.liked : ''}`}
            aria-label="게시글 공감하기"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
            <span>공감 {likes}</span>
          </button>
        </div>
      </article>

      {/* Comments Section */}
      <section className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>
          댓글 <span>{comments.length}</span>
        </h2>

        {/* Comment Write Form */}
        <form onSubmit={handleAddComment} className={styles.commentForm}>
          <textarea
            placeholder="캠퍼스 동료에게 따뜻한 댓글을 남겨주세요."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className={styles.commentInput}
            rows={3}
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
            <button type="submit" className={styles.commentSubmitBtn} disabled={!commentText.trim()}>
              등록
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className={styles.commentList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentItemHeader}>
                <span className={styles.commentAuthor}>
                  {comment.anonymousNickname
                    ? comment.anonymousNickname
                    : comment.isAnonymous
                    ? `익명 ${comment.anonymousIndex || ''}`
                    : '학우'}
                </span>
                <time className={styles.commentTime}>{formatRelativeTime(comment.createdAt)}</time>
              </div>
              <p className={styles.commentContent}>{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
