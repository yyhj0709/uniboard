/**
 * Prisma Client 인스턴스 관리 파일 (향후 연동용 스텁)
 * 
 * 다음 단계에서 `npm install @prisma/client` 및 `npm install -D prisma` 설치 후
 * 아래 주석을 해제하여 Next.js 개발 환경에서의 싱글톤 클라이언트로 사용할 수 있습니다.
 */

// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
//   });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const DB_READY = false; // 현재 단계에서는 DB 연동 제외
