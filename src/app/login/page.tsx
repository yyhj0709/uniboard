import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>UNIBOARD 로그인</h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
        대학생 인증 및 익명 계정 로그인 시스템이 다음 단계에서 구축될 예정입니다.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
