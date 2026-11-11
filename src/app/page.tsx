import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          <span>대학생 익명 커뮤니티 플랫폼</span>
        </div>
        
        <h1 className={styles.heroTitle}>
          캠퍼스 라이프를 연결하는 <br className={styles.breakDesktop} />
          <span className={styles.highlight}>가장 솔직한 이야기, UNIBOARD</span>
        </h1>
        
        <p className={styles.heroDescription}>
          익명으로 나누는 생생한 캠퍼스 이야기와 궁금증을 즉시 해결해주는 AI 대화방까지.<br className={styles.breakDesktop} />
          대학생들을 위한 안전하고 스마트한 소통 공간에 오신 것을 환영합니다.
        </p>

        <div className={styles.ctaGroup}>
          <Link href="/community" className={styles.primaryCta}>
            커뮤니티 둘러보기
          </Link>
          <Link href="/chat" className={styles.secondaryCta}>
            AI 대화방 바로가기
          </Link>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>UNIBOARD 주요 기능</h2>
          <p className={styles.sectionSubtitle}>학생들의 더 나은 대학 생활을 위해 준비된 핵심 경험</p>
        </div>

        <div className={styles.featureGrid}>
          {/* Card 1 */}
          <div className={styles.featureCard}>
            <div className={`${styles.iconWrap} ${styles.iconShield}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>철저한 익명성 보장</h3>
            <p className={styles.cardDesc}>
              개인정보 노출 걱정 없이 학업, 진로, 일상에 대한 솔직한 생각과 고민을 자유롭게 나눌 수 있습니다.
            </p>
          </div>

          {/* Card 2 */}
          <div className={styles.featureCard}>
            <div className={`${styles.iconWrap} ${styles.iconSparkle}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>스마트 AI 대화방</h3>
            <p className={styles.cardDesc}>
              강의 팁, 과제 고민, 생활 정보 등 궁금한 점을 언제든지 실시간으로 묻고 답변받을 수 있는 스마트 AI 어시스턴트입니다.
            </p>
          </div>

          {/* Card 3 */}
          <div className={styles.featureCard}>
            <div className={`${styles.iconWrap} ${styles.iconUsers}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>대학생 전용 소통 네트워크</h3>
            <p className={styles.cardDesc}>
              같은 고민을 가진 또래 학생들과 공감하고, 검증된 정보와 유용한 캠퍼스 꿀팁을 공유해보세요.
            </p>
          </div>
        </div>
      </section>

      {/* Category Preview Banner */}
      <section className={styles.previewSection}>
        <div className={styles.previewContainer}>
          <div className={styles.previewHeader}>
            <span className={styles.previewTag}>COMMUNITY PREVIEW</span>
            <h3 className={styles.previewTitle}>다양한 카테고리의 게시판이 준비 중입니다</h3>
            <p className={styles.previewDesc}>자유게시판, 비밀고민, 취업/진로, 중고장터 등 대학생에게 꼭 필요한 주제별 게시판</p>
          </div>
          
          <div className={styles.tagGrid}>
            <span className={styles.topicBadge}>💬 자유 이야기</span>
            <span className={styles.topicBadge}>🔒 비밀 상담소</span>
            <span className={styles.topicBadge}>💼 취업 & 대외활동</span>
            <span className={styles.topicBadge}>📚 시험 족보 & 스터디</span>
            <span className={styles.topicBadge}>🤖 AI 캠퍼스 튜터</span>
          </div>
        </div>
      </section>
    </div>
  );
}
