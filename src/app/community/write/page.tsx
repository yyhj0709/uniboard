
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES } from '@/mocks/posts';
import styles from './write.module.css';

export default function WritePage() {
  const router = useRouter();

  const [category, setCategory] = useState<
    'FREE' | 'SECRET' | 'CAREER' | 'INFO' | 'MARKET'
  >('FREE');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [nickname, setNickname] = useState('익명');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch('/api/mypage', {
          cache: 'no-store',
        });

        setIsLoggedIn(response.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해 주세요.');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          title: title.trim(),
          content: content.trim(),
          isAnonymous,
          nickname: isAnonymous ? nickname.trim() : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || '게시글 작성에 실패했습니다.');

        if (response.status === 401) {
          router.push('/login');
        }

        return;
      }

      alert('게시글이 등록되었습니다.');
      router.push('/community');
      router.refresh();
    } catch (error) {
      console.error('게시글 등록 오류:', error);
      alert('서버와 통신할 수 없습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn === null) {
    return (
      <div className={styles.container}>
        <p>로그인 상태를 확인하고 있습니다...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인이 필요합니다</h1>
          <p className={styles.subtitle}>
            게시글을 작성하려면 먼저 로그인해 주세요.
          </p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.actions}>
            <Link href="/community" className={styles.cancelBtn}>
              목록으로
            </Link>

            <Link href="/login" className={styles.submitBtn}>
              로그인하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>새 게시글 작성</h1>
        <p className={styles.subtitle}>
          여러분의 생각과 이야기를 자유롭게 나눠보세요.
        </p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>게시판 선택</label>

          <div className={styles.categoryGrid}>
            {CATEGORIES.filter((item) => item.id !== 'ALL')
              .concat({
                id: 'MARKET',
                name: '장터',
                description: '물건을 사고파는 공간',
                icon: '🛍️',
              })
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.catButton} ${
                    category === item.id ? styles.catButtonActive : ''
                  }`}
                  onClick={() => setCategory(item.id as typeof category)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="title">
            제목
          </label>

          <input
            id="title"
            className={styles.textInput}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="게시글 제목을 입력해 주세요."
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="content">
            내용
          </label>

          <textarea
            id="content"
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={10000}
            rows={14}
            placeholder="다른 학우들과 나누고 싶은 이야기를 작성해 주세요."
            required
          />
          <p className={styles.subtitle}>
            {content.length.toLocaleString()} / 10,000자
          </p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>작성 옵션</label>

          <div className={styles.optionRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              익명으로 작성하기
            </label>

            {isAnonymous && (
              <input
                className={styles.nicknameInput}
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={30}
                placeholder="익명 닉네임"
                aria-label="익명 닉네임"
              />
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => router.push('/community')}
          >
            취소
          </button>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '게시글 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
