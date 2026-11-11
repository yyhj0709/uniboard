import Link from 'next/link';
import { PostWithComments } from '@/mocks/posts';
import { formatRelativeTime } from '@/lib/format';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: PostWithComments;
}

const CATEGORY_NAMES: Record<string, string> = {
  FREE: '자유',
  SECRET: '비밀고민',
  CAREER: '취업/진로',
  INFO: '캠퍼스 정보',
  MARKET: '장터',
};

export default function PostCard({ post }: PostCardProps) {
  const categoryName = CATEGORY_NAMES[post.category] || post.category;

  return (
    <article className={styles.card}>
      <Link href={`/community/${post.id}`} className={styles.cardLink}>
        {/* Header */}
        <div className={styles.header}>
          <span className={`${styles.categoryBadge} ${styles[post.category.toLowerCase()]}`}>
            {categoryName}
          </span>
          {post.isHot && <span className={styles.hotBadge}>🔥 HOT</span>}
          <span className={styles.dot}>•</span>
          <span className={styles.author}>{post.anonymousNickname || '익명'}</span>
          <span className={styles.dot}>•</span>
          <time className={styles.time}>{formatRelativeTime(post.createdAt)}</time>
        </div>

        {/* Content */}
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.content}</p>

        {/* Meta / Footer */}
        <div className={styles.footer}>
          <div className={styles.metaItem}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
            <span>{post.likeCount}</span>
          </div>

          <div className={styles.metaItem}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>{post.commentCount}</span>
          </div>

          <div className={styles.metaItem}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>{post.viewCount}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
