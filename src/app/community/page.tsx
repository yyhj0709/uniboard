
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  CATEGORIES,
  CategoryInfo,
  PostWithComments,
} from '@/mocks/posts';
import PostCard from '@/components/community/PostCard';
import styles from './community.module.css';

const BOARD_CATEGORIES: CategoryInfo[] = [
  ...CATEGORIES.filter((category) => category.id !== 'MARKET'),
  {
    id: 'MARKET',
    name: '장터',
    description: '필요한 물건을 사고팔아요',
    icon: '🛍️',
  },
];

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    PostWithComments['category'] | 'ALL'
  >('ALL');

  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<PostWithComments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch('/api/posts', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('게시글을 불러오지 못했습니다.');
        }

        const result = await response.json();

        const formattedPosts: PostWithComments[] = result.posts.map(
          (post: {
            id: string;
            authorId: string;
            category: string;
            title: string;
            content: string;
            isAnonymous: boolean;
            anonymousNickname: string | null;
            viewCount: number;
            likeCount: number;
            commentCount: number;
            createdAt: string;
            updatedAt: string;
          }) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category as PostWithComments['category'],
            authorId: post.authorId,
            isAnonymous: post.isAnonymous,
            anonymousNickname: post.anonymousNickname || '익명',
            viewCount: post.viewCount,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            isHot: false,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
            comments: [],
          })
        );

        setPosts(formattedPosts);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '게시글을 불러오는 중 오류가 발생했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        post.category === selectedCategory;

      const matchesSearch =
        post.title.toLowerCase().includes(keyword) ||
        post.content.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const selectedCategoryInfo = BOARD_CATEGORIES.find(
    (category) => category.id === selectedCategory
  );

  return (
    <div className={styles.container}>
      <section className={styles.heroBanner}>
        <div>
          <span className={styles.heroBadge}>UNIBOARD COMMUNITY</span>

          <h1 className={styles.heroTitle}>커뮤니티</h1>

          <p className={styles.heroSubtitle}>
            자유롭게 소통하고 다양한 대학 생활 정보를 나눠보세요.
          </p>
        </div>

        <Link href="/community/write" className={styles.writeButton}>
          <span>＋</span>
          글쓰기
        </Link>
      </section>

      <nav className={styles.categoryNav} aria-label="게시판 카테고리">
        {BOARD_CATEGORIES.map((category: CategoryInfo) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={selectedCategory === category.id}
            className={`${styles.tabBtn} ${
              selectedCategory === category.id ? styles.activeTab : ''
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </nav>

      <section className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="궁금한 게시글을 검색해 보세요."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className={styles.searchInput}
          />

          {searchQuery && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery('')}
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>

        <p className={styles.postCount}>
          총 <strong>{filteredPosts.length}</strong>개의 게시글
        </p>
      </section>

      {selectedCategoryInfo && selectedCategory !== 'ALL' && (
        <p className={styles.categoryDescription}>
          {selectedCategoryInfo.description}
        </p>
      )}

      {isLoading ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>게시글을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>{error}</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className={styles.postList}>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📝</span>

          <h2 className={styles.emptyTitle}>
            {searchQuery
              ? '검색 결과가 없습니다.'
              : '아직 게시글이 없습니다.'}
          </h2>

          <p className={styles.emptyDesc}>
            {searchQuery
              ? '다른 검색어로 다시 검색해 보세요.'
              : '이 카테고리의 첫 번째 게시글을 작성해 보세요.'}
          </p>

          {!searchQuery && (
            <Link href="/community/write" className={styles.emptyCta}>
              글 작성하기
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
