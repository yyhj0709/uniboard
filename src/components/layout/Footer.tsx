import Link from 'next/link';
import { SITE_CONFIG } from '@/constants/navigation';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logoText}>{SITE_CONFIG.name}</span>
            <p className={styles.description}>{SITE_CONFIG.description}</p>
          </div>
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <span className={styles.groupTitle}>서비스</span>
              <Link href="/community" className={styles.link}>커뮤니티</Link>
              <Link href="/chat" className={styles.link}>AI 대화방</Link>
            </div>
            <div className={styles.linkGroup}>
              <span className={styles.groupTitle}>안내</span>
              <span className={styles.linkDisabled}>이용약관</span>
              <span className={styles.linkDisabled}>개인정보처리방침</span>
              <span className={styles.linkDisabled}>커뮤니티 이용규칙</span>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved. 대학생을 위한 익명 커뮤니티
          </p>
        </div>
      </div>
    </footer>
  );
}
