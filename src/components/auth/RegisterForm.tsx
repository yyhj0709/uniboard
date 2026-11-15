'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const clearPasswords = () => {
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedUsername = username.trim().toLowerCase();

    // 1. 아이디 검증: 영문 소문자, 숫자, 밑줄(_) 4~20자
    if (!/^[a-z0-9_]{4,20}$/.test(trimmedUsername)) {
      setErrorMessage('아이디는 영문 소문자, 숫자, 밑줄(_)로 4~20자여야 합니다.');
      clearPasswords();
      return;
    }

    // 2. 비밀번호 길이 검증: 8~128자
    if (password.length < 8 || password.length > 128) {
      setErrorMessage('비밀번호는 8~128자로 입력해 주세요.');
      clearPasswords();
      return;
    }

    // 3. 비밀번호 확인 일치 검증
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호 확인이 일치하지 않습니다.');
      clearPasswords();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
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

      if (response.status === 201) {
        setIsSuccess(true);
        setSuccessMessage(data.message || '회원가입이 완료되었습니다.');
      } else if (response.status === 409) {
        setErrorMessage(data.message || '이미 사용 중인 아이디입니다.');
      } else if (data.message) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } catch {
      setErrorMessage('네트워크 오류가 발생했습니다. 서버 연결 상태를 확인해 주세요.');
    } finally {
      setIsLoading(false);
      // 요청 이후 비밀번호 입력란 초기화
      clearPasswords();
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>🎓</span>
        <h1 className={styles.title}>UNIBOARD 회원가입</h1>
        <p className={styles.subtitle}>
          대학생 익명 커뮤니티 UNIBOARD에 오신 것을 환영합니다.
        </p>
      </div>

      {isSuccess && successMessage ? (
        <div className={styles.successBox}>
          <p>🎉 {successMessage}</p>
          <p style={{ fontSize: '0.85rem', color: '#047857' }}>
            가입한 계정으로 로그인하여 다양한 캠퍼스 이야기를 나눠보세요.
          </p>
          <Link href="/login" className={styles.successLoginBtn}>
            로그인 페이지로 이동
          </Link>
        </div>
      ) : (
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
              placeholder="영문 소문자, 숫자, _ (4~20자)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
              required
            />
            <span className={styles.hint}>
              영문 소문자, 숫자, 밑줄(_)만 사용 가능하며 4~20자 이내입니다.
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="비밀번호 입력 (8~128자)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
            <span className={styles.hint}>8자 이상 128자 이하로 입력해 주세요.</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.input}
              placeholder="비밀번호 다시 입력"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '회원가입'}
          </button>
        </form>
      )}

      <div className={styles.footer}>
        <span>이미 계정이 있으신가요?</span>
        <Link href="/login" className={styles.loginLink}>
          로그인
        </Link>
      </div>
    </div>
  );
}
