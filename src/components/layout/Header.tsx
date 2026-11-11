'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NAV_ITEMS, SITE_CONFIG } from '@/constants/navigation';
import styles from './Header.module.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
          <span className={styles.logoBadge}>U</span>
          <span className={styles.logoText}>{SITE_CONFIG.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.isPrimary ? styles.loginBtn : styles.navLink}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
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

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <nav className={styles.mobileNav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.isPrimary ? styles.mobileLoginBtn : styles.mobileNavLink}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
