import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import styles from './login.module.css';

export const metadata: Metadata = {
  title: '로그인',
  description: '대학생 익명 커뮤니티 UNIBOARD 로그인',
};

export default function LoginPage() {
  return (
    <main className={styles.main}>
      <LoginForm />
    </main>
  );
}
