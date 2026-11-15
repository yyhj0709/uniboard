import type { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';
import styles from './register.module.css';

export const metadata: Metadata = {
  title: '회원가입',
  description: '대학생 익명 커뮤니티 UNIBOARD에 가입하세요.',
};

export default function RegisterPage() {
  return (
    <main className={styles.main}>
      <RegisterForm />
    </main>
  );
}
