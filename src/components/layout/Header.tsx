
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MAIN_NAV_ITEMS, SITE_CONFIG } from '@/constants/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const result = await logout();
      if (result.success) {
        closeMobileMenu();
        router.push('/');
      } else {
        alert(result.message || '로그아웃 처리 중 오류가 발생했습니다.');
      }
    } catch {
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
          <span className={styles.logoBadge}>U</span>
          <span className={styles.logoText}>{SITE_CONFIG.name}</span>
        </Link>

        <nav className={styles.desktopNav}>
          {MAIN_NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}

          <div className={styles.authContainer}>
            {isLoading ? (
              <div className={styles.authLoadingSkeleton} aria-hidden="true" />
            ) : user ? (
              <div className={styles.userSection}>
                <span className={styles.userGreeting}>
                  <span className={styles.userIcon}>👤</span>
                  <strong className={styles.username}>{user.username}</strong>님
                </span>

                <Link href="/mypage" className={styles.navLink}>
                  마이페이지
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={styles.logoutBtn}
                >
                  {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </button>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link href="/login" className={styles.loginBtn}>
                  로그인
                </Link>
                <Link href="/register" className={styles.registerBtn}>
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </nav>

        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileMenuOpen}
        >
          <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpen3 : ''}`} />
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className={styles.mobileNav}>
          {MAIN_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}

          <div className={styles.mobileAuthSection}>
            {isLoading ? (
              <div className={styles.mobileAuthSkeleton} aria-hidden="true" />
            ) : user ? (
              <div className={styles.mobileUserGroup}>
                <div className={styles.mobileUserGreeting}>
                  <span>👤</span>
                  <span>
                    <strong>{user.username}</strong>님 반갑습니다.
                  </span>
                </div>

                <Link
                  href="/mypage"
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                >
                  마이페이지
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={styles.mobileLogoutBtn}
                >
                  {isLoggingOut ? '로그아웃 처리 중...' : '로그아웃'}
                </button>
              </div>
            ) : (
              <div className={styles.mobileAuthBtnGroup}>
                <Link
                  href="/login"
                  className={styles.mobileLoginBtn}
                  onClick={closeMobileMenu}
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className={styles.mobileRegisterBtn}
                  onClick={closeMobileMenu}
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
