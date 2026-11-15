
export interface NavItem {
  label: string;
  href: string;
  isPrimary?: boolean;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: '커뮤니티', href: '/community' },
];

export const NAV_ITEMS: NavItem[] = [
  ...MAIN_NAV_ITEMS,
  { label: '로그인', href: '/login', isPrimary: true },
];

export const SITE_CONFIG = {
  name: 'UNIBOARD',
  description: '대학생을 위한 익명 커뮤니티',
  tagline: '가장 솔직한 대학생들의 이야기 공간',
};
