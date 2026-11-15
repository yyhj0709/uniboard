'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUsername = username.trim().toLowerCase();

    // 1. 입력값 검증 (비어 있는 경우 요청 차단)
    if (!trimmedUsername || !password) {
      setErrorMessage('아이디와 비밀번호를 모두 입력해 주세요.');
      setPassword('');
      return;
    }

    setIsLoading(true);

    try {
      // 2. 로그인 API 호출 (POST /api/auth/login)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(
          data.message || '아이디 또는 비밀번호가 올바르지 않습니다.'
        );
        return;
      }

      // 3. 전역 인증 상태 갱신 (GET /api/auth/me 확인 포함)
      await refreshUser();

      // 4. 로그인 성공 시 메인 페이지(/)로 이동
      router.push('/');
    } catch {
      setErrorMessage('네트워크 오류가 발생했습니다. 서버 연결 상태를 확인해 주세요.');
    } finally {
      setIsLoading(false);
      // 보안을 위해 로그인 요청 처리 후 비밀번호 필드 초기화
      setPassword('');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>🎓</span>
        <h1 className={styles.title}>UNIBOARD 로그인</h1>
        <p className={styles.subtitle}>
          대학생 익명 커뮤니티 UNIBOARD에 오신 것을 환영합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {errorMessage && (
          <div className={styles.errorBox} role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            아이디
          </label>
          <input
            id="username"
            type="text"
            className={styles.input}
            placeholder="아이디 입력"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            autoComplete="username"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className={styles.footer}>
        <span>아직 계정이 없으신가요?</span>
        <Link href="/register" className={styles.registerLink}>
          회원가입
        </Link>
      </div>
    </div>
  );
}
