/**
 * UNIBOARD 프로젝트의 핵심 타입 정의
 * 향후 Prisma ORM 및 PostgreSQL 스키마와 동기화하여 확장할 수 있습니다.
 */

// 사용자 프로필 및 계정 (익명 닉네임 기본 지원)
export interface User {
  id: string;
  email?: string;
  universityName: string;
  isVerified: boolean;
  createdAt: Date;
}

// 커뮤니티 게시글 (익명 지원)
export interface Post {
  id: string;
  title: string;
  content: string;
  category: 'FREE' | 'SECRET' | 'CAREER' | 'MARKET' | 'INFO';
  authorId: string;
  isAnonymous: boolean;
  anonymousNickname?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 댓글
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  isAnonymous: boolean;
  anonymousIndex?: number; // 익명1, 익명2 등
  anonymousNickname?: string; // 작성자 표기 등
  createdAt: Date;
}

// AI 대화방 메시지
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}
