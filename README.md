# UNIBOARD

대학생을 위한 익명 커뮤니티 & 스마트 캠퍼스 라이프 웹 플랫폼

---

## 1. 프로젝트 개요
**UNIBOARD**는 대학생들이 자유롭고 솔직하게 학업, 진로, 일상 고민을 나눌 수 있는 익명 커뮤니티이자, 실시간 캠퍼스 정보를 질의응답할 수 있는 AI 대화방을 제공하는 모던 웹 서비스입니다.

---

## 2. 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 19, TypeScript
- **Styling**: CSS (CSS Modules & Modern Semantic Design Tokens)
- **Database (향후 예정)**: PostgreSQL, Prisma ORM

---

## 3. 폴더 구조
```text
uniboard/
├── src/
│   ├── app/                    # Next.js App Router (페이지 및 레이아웃)
│   │   ├── globals.css         # 전역 CSS 변수 및 리셋 스타일
│   │   ├── layout.tsx          # 전역 레이아웃 (공통 Header, Footer 포함)
│   │   ├── page.tsx            # 메인 홈페이지
│   │   ├── page.module.css     # 홈페이지 전용 스타일 모듈
│   │   ├── community/          # [향후] 커뮤니티 게시판 라우트
│   │   ├── chat/               # [향후] AI 대화방 라우트
│   │   └── login/              # [향후] 인증/로그인 라우트
│   ├── components/             # 재사용 가능한 UI 컴포넌트
│   │   └── layout/             # 레이아웃 관련 컴포넌트
│   │       ├── Header.tsx      # 반응형 상단 네비게이션 헤더 (모바일 메뉴 지원)
│   │       ├── Header.module.css
│   │       ├── Footer.tsx      # 하단 푸터
│   │       └── Footer.module.css
│   ├── constants/              # 프로젝트 전역 상수
│   │   └── navigation.ts       # 메뉴 목록 및 사이트 메타 정보
│   ├── lib/                    # 유틸리티 및 클라이언트 설정
│   │   └── prisma.ts           # Prisma ORM 클라이언트 연동용 스텁
│   └── types/                  # 전역 TypeScript 인터페이스
│       └── index.ts            # User, Post, Comment, ChatMessage 등 모델 정의
├── next.config.mjs             # Next.js 설정
├── tsconfig.json               # TypeScript 컴파일러 설정 (@/* 경로 alias 지원)
├── package.json                # 의존성 및 스크립트 관리
└── .gitignore                  # Git 추적 제외 설정
```

---

## 4. 실행 방법

### 개발 서버 실행
```bash
npm run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인할 수 있습니다.

### 프로덕션 빌드 및 실행
```bash
npm run build
npm run start
```

---

## 5. 주요 파일의 역할
| 파일 경로 | 역할 |
| :--- | :--- |
| `src/app/layout.tsx` | 전체 웹사이트의 공통 골격, 반응형 Header와 Footer, 메타데이터를 관리합니다. |
| `src/app/page.tsx` | UNIBOARD 메인 랜딩 페이지로, 서비스 소개, 핵심 가치 카드, 게시판 프리뷰를 제공합니다. |
| `src/components/layout/Header.tsx` | 로고 및 메뉴(커뮤니티, AI 대화방, 로그인)를 포함하며 PC 및 모바일 반응형 햄버거 메뉴를 지원합니다. |
| `src/app/globals.css` | 테마 색상(블루, 인디고, 뉴트럴 등)과 공통 타이포그래피, 반응형 디자인 토큰을 정의합니다. |
| `src/types/index.ts` | 향후 PostgreSQL/Prisma 스키마와 매핑될 사용자, 게시글, 댓글, AI 메시지 타입 인터페이스를 사전 정의합니다. |
| `src/lib/prisma.ts` | 이후 데이터베이스 연동 단계에서 활성화할 Prisma 싱글톤 클라이언트 템플릿입니다. |
