'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/mocks/posts';
import styles from './write.module.css';

export default function WritePage() {
  const router = useRouter();
  const [category, setCategory] = useState<'FREE' | 'SECRET' | 'CAREER' | 'INFO'>('FREE');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [nickname, setNickname] = useState('익명의학우');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    alert('게시글이 성공적으로 등록되었습니다! (목업 등록 완료)');
    router.push('/community');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>새 글 작성</h1>
        <p className={styles.subtitle}>대학 동료들과 함께 나누고 싶은 이야기를 적어보세요.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        {/* Category Selection */}
        <div className={styles.formGroup}>
          <label className={styles.label}>게시판 카테고리</label>
          <div className={styles.categoryGrid}>
            {CATEGORIES.filter((c) => c.id !== 'ALL').map((c) => (
              <button
                type="button"
                key={c.id}
                className={`${styles.catButton} ${category === c.id ? styles.catButtonActive : ''}`}
                onClick={() => setCategory(c.id as any)}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>제목</label>
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.textInput}
            required
          />
        </div>

        {/* Content */}
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>본문</label>
          <textarea
            id="content"
            placeholder="학우들에게 전하고 싶은 이야기, 질문, 정보 등을 자유롭게 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
            rows={10}
            required
          />
        </div>

        {/* Anonymous option */}
        <div className={styles.optionRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <span>익명으로 게시하기</span>
          </label>

          {isAnonymous && (
            <input
              type="text"
              placeholder="익명 닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={styles.nicknameInput}
            />
          )}
        </div>

        {/* Submit Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.cancelBtn}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className={styles.submitBtn}
          >
            게시글 등록하기
          </button>
        </div>
      </form>
    </div>
  );
}
