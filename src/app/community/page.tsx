'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CATEGORIES, MOCK_POSTS, CategoryInfo } from '@/mocks/posts';
import PostCard from '@/components/community/PostCard';
import styles from './community.module.css';

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo['id']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter((post) => {
      const matchCategory =
        selectedCategory === 'ALL' || post.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className={styles.container}>
      {/* Community Header Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroText}>
          <span className={styles.heroBadge}>UNIBOARD 익명 광장</span>
          <h1 className={styles.heroTitle}>대학생 익명 커뮤니티</h1>
          <p className={styles.heroSubtitle}>
            동기, 선후배들과 함께 나누는 솔직담백한 대학 생활 이야기
          </p>
        </div>
        <Link href="/community/write" className={styles.writeButton}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          <span>익명 글쓰기</span>
        </Link>
      </section>

      {/* Category Tabs */}
      <nav className={styles.categoryNav}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.tabBtn} ${selectedCategory === cat.id ? styles.activeTab : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className={styles.tabIcon}>{cat.icon}</span>
            <span className={styles.tabName}>{cat.name}</span>
          </button>
        ))}
      </nav>

      {/* Search & Sort Controls */}
      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="게시글 제목이나 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={styles.clearSearchBtn}
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>
        <div className={styles.postCount}>
          총 <strong>{filteredPosts.length}</strong>개의 이야기
        </div>
      </div>

      {/* Posts List */}
      <div className={styles.postList}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>해당하는 게시글이 없습니다.</h3>
            <p className={styles.emptyDesc}>다른 검색어를 입력하거나 새로운 첫 게시글을 작성해보세요!</p>
            <Link href="/community/write" className={styles.emptyCta}>
              새 글 작성하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
