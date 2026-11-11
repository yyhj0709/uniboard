import { Post, Comment } from '@/types';

export interface CategoryInfo {
  id: Post['category'] | 'ALL';
  name: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'ALL', name: '전체', description: '모든 게시글을 한눈에 확인하세요', icon: '🔥' },
  { id: 'FREE', name: '자유게시판', description: '자유롭게 일상과 생각을 공유하는 공간', icon: '💬' },
  { id: 'SECRET', name: '비밀고민', description: '100% 익명으로 털어놓는 솔직한 이야기', icon: '🔒' },
  { id: 'CAREER', name: '취업/진로', description: '인턴, 자격증, 취업 꿀팁 및 상담', icon: '💼' },
  { id: 'INFO', name: '캠퍼스 정보', description: '수강신청, 족보, 학사 일정 공유', icon: '📚' },
];

export interface PostWithComments extends Post {
  comments: Comment[];
  isHot?: boolean;
}

export const MOCK_POSTS: PostWithComments[] = [
  {
    id: 'post-1',
    title: '중간고사 끝나고 전공 프로젝트 팀원 구합니다 (컴공/SW)',
    content: `안녕하세요! 이번 2학기 모바일 앱 개발 프로젝트 함께 진행하실 팀원 2분을 찾습니다.
주제는 대학생 생활 편의 웹/앱 서비스이며, 현재 프론트엔드 1명, 기획/디자인 1명 있습니다.
React나 Next.js 경험 있으시거나 백엔드(Node/Java) 다루실 수 있는 분 환영합니다!
부담 없이 편하게 댓글 남겨주세요. 같이 공모전까지 노려봐요!`,
    category: 'FREE',
    authorId: 'user-101',
    isAnonymous: true,
    anonymousNickname: '코딩하는부엉이',
    viewCount: 342,
    likeCount: 28,
    commentCount: 5,
    isHot: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 35), // 35분 전
    updatedAt: new Date(Date.now() - 1000 * 60 * 35),
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorId: 'user-201',
        content: '백엔드 스프링부트 주로 다루는데 지원 가능할까요?',
        isAnonymous: true,
        anonymousIndex: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 25),
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorId: 'user-101',
        content: '네 스프링부트 백엔드 대환영입니다! 같이 해요!',
        isAnonymous: true,
        anonymousNickname: '작성자',
        createdAt: new Date(Date.now() - 1000 * 60 * 20),
      },
      {
        id: 'c-3',
        postId: 'post-1',
        authorId: 'user-202',
        content: 'Next.js 프론트엔드 포트폴리오 준비 중인 3학년인데 혹시 자리 남았나요?',
        isAnonymous: true,
        anonymousIndex: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
      },
    ],
  },
  {
    id: 'post-2',
    title: '요즘 진로 때문에 불면증까지 오는 것 같아.. 솔직한 조언 부탁해',
    content: `3학년 2학기 접어드니까 주변 동기들은 벌써 인턴 합격하고 어학 점수 다 만들어뒀더라.
나는 아직 뭘 하고 싶은지도 확실하지 않고 남들 따라 자격증만 깔짝거리는 중인데,
점점 뒤처지는 기분 들고 밤마다 자책하게 됨.. 다들 이 시기 어떻게 극복했어? 선배님들 이야기 듣고 싶어.`,
    category: 'SECRET',
    authorId: 'user-102',
    isAnonymous: true,
    anonymousNickname: '새벽감성사슴',
    viewCount: 580,
    likeCount: 45,
    commentCount: 8,
    isHot: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2시간 전
    updatedAt: new Date(Date.now() - 1000 * 60 * 120),
    comments: [
      {
        id: 'c-4',
        postId: 'post-2',
        authorId: 'user-301',
        content: '졸업생인데 3학년 2학기면 절대 늦은 거 아니야. 남들이랑 속도 비교하지 말고 하루에 딱 1개씩만 루틴 채워봐. 응원한다.',
        isAnonymous: true,
        anonymousIndex: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 90),
      },
      {
        id: 'c-5',
        postId: 'post-2',
        authorId: 'user-302',
        content: '나도 작년에 똑같이 멘탈 터졌었는데 학교 상담센터에서 진로상담 2번 받고 큰 도움 받았어. 센터 무료니까 꼭 가봐!',
        isAnonymous: true,
        anonymousIndex: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
      },
    ],
  },
  {
    id: 'post-3',
    title: '하반기 대기업 IT 기획/마케팅 인턴 면접 합격 후기 & 면접 질문 정리',
    content: `안녕하세요! 이번 하반기 인턴십 면접 합격해서 조금이나마 도움 드리고자 후기 남깁니다.
1차 직무면접에서는 자기소개서 프로젝트 경험 기반 꼬리질문이 많았고,
2차 컬처핏에서는 협업 시 갈등 해결 경험을 집중적으로 물어봤습니다.
핵심 팁: STAR 기법으로 수치화된 성과를 1분 이내로 간결하게 말하는 연습이 가장 주효했습니다.
궁금한 점 질문 주시면 아는 선에서 답변 드릴게요!`,
    category: 'CAREER',
    authorId: 'user-103',
    isAnonymous: true,
    anonymousNickname: '취업뽀개기러너',
    viewCount: 890,
    likeCount: 112,
    commentCount: 14,
    isHot: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5시간 전
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    comments: [
      {
        id: 'c-6',
        postId: 'post-3',
        authorId: 'user-401',
        content: '합격 진심으로 축하드립니다! 혹시 포트폴리오 장수는 몇 장 정도로 준비하셨나요?',
        isAnonymous: true,
        anonymousIndex: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      },
    ],
  },
  {
    id: 'post-4',
    title: '중앙도서관 4층 노트북 열람실 와이파이 속도 복구됐나요?',
    content: `아침에 인터넷 끊겨서 과제 제출하려다 식은땀 흘렸는데 지금은 정상 작동하나요?
지금 가려는데 사람 많은지도 궁금합니다!`,
    category: 'INFO',
    authorId: 'user-104',
    isAnonymous: true,
    anonymousNickname: '도서관지박령',
    viewCount: 120,
    likeCount: 4,
    commentCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8시간 전
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    comments: [],
  },
  {
    id: 'post-5',
    title: '학식 오늘 점심 치즈돈까스 역대급인데 다들 먹었어?',
    content: `진짜 치즈 양 미쳤음.. 5,500원의 행복이다 오늘은 꼭 학식 가라 동지들아`,
    category: 'FREE',
    authorId: 'user-105',
    isAnonymous: true,
    anonymousNickname: '배고픈대학생',
    viewCount: 215,
    likeCount: 19,
    commentCount: 6,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    comments: [],
  },
];
