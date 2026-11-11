import Link from 'next/link';

export default function ChatPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>AI 대화방</h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
        대학 생활, 진로, 학업 꿀팁을 실시간으로 물어볼 수 있는 스마트 AI 어시스턴트 기능이 준비 중입니다.
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
