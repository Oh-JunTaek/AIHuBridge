import type { SVGProps, JSX } from 'react';

type Icon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

/** icon/LOGO.png 정사각 로고 → SVG 래퍼 (Vite base 경로 자동 처리) */
export const LogoIcon: Icon = (props) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <image
      href={`${import.meta.env.BASE_URL}icon/LOGO.png`}
      width="32"
      height="32"
    />
  </svg>
);

export const BadgeIcon: Icon = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    {...p}
  >
    <circle cx={12} cy={12} r={10} />
    <circle cx={12} cy={12} r={4} fill="currentColor" />
  </svg>
);


export const SettingsIcon: Icon = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    {...p}
  >
    <path d="M12 7.5v3.5l2 1.5" />
    <circle cx={12} cy={12} r={7.5} />
  </svg>
);

export const DevIcon: Icon = (p) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    {...p}
  >
    <path d="M12 7.5v3.5l2 1.5" />
    <circle cx={12} cy={12} r={7.5} />
  </svg>
);