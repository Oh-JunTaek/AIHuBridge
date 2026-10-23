import type { SVGProps } from 'react';
import type { JSX } from 'react';

type Icon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

export const CompassIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <circle cx={12} cy={12} r={10} />
    <path d="M12 16l-4-4 4-4 4 4-4 4z" />
  </svg>
);

export const HomeIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M3 9.75L12 4l9 5.75V21a.75.75 0 01-.75.75h-5.5v-5H11v5H5.75A.75.75 0 015 21z" />
  </svg>
);

export const BookIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M5.25 3.75A1 1 0 004 4.75v14.5a1 1 0 001.493.891L12 17.5l6.507 3.641A1 1 0 0020 20.25V5.75a1 1 0 00-1-1H5.25z" />
  </svg>
);

export const PathIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 00-6.32 16.95c.5.1.69-.22.69-.49 0-.24-.01-1.04-.01-1.88-2.07.37-2.53-.49-2.69-.94-.09-.23-.3-.36-.55-.45-.18-.07-.36-.09-.55-.01A3.43 3.43 0 004.25 12.4c0 .77.42 1.43 1.04 1.8-.01.07-.01.12 0 .14 0 1.03.52 1.91 1.4.47A3.22 3.22 0 017.25 16c-.94 0-1.84-.19-2.72-.55a1.07 1.07 0 01-.28-1.81 5.66 5.66 0 010-3.89 1.07 1.07 0 011.72.28A3.4 3.4 0 007.5 12c0 .34-.03.68-.1 1.01a4.53 4.53 0 003.29-.33 3.43 3.43 0 003.71 0 4.52 4.52 0 00-.02-.9c.65-.2 1.3-.46 1.9-.8a1.07 1.07 0 011.39 1.26 4.5 4.5 0 010 3.79z" />
  </svg>
);

export const BadgeIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const QuizIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M9.09 14.81a6 6 0 105.81-6.89 3.5 3.5 0 10-5.81 6.89z" />
    <line x1={12} y1={19} x2={12.01} y2={19} />
  </svg>
);

export const SparkleIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2l1.9 5.3H18l-3 4.6 3 4.6-1.9 5.3-1.9-5.3H8.1l3-4.6-3-4.6h4.1z" />
    <path d="M4.5 4.5l1-1 1 1-1 1-1-1z" />
  </svg>
);

export const CheckIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M20.35 6.24L9 17.6l-4.35-4.35-1.4 1.4L9 20.4 21.75 7.6z" />
  </svg>
);

export const TrendIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M3 17l6-6 4 4 5-5 7 7v4H3z" />
  </svg>
);

export const ClockIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <circle cx={12} cy={12} r={9} />
    <path d="M12 7v5l3 3" />
  </svg>
);

export const StarIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 17.27L19.7 21l-2.64-6.03L22 11.79l-3-.29L12 7.6l-7 3.9-3 2.9 5.24 3.18z" />
  </svg>
);

export const XIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const SettingsIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <circle cx={12} cy={12} r={3} />
    <path d="M12 1v5m0 12v5M4.22 4.22l3.54 3.54m8.48 8.48 3.54 3.54M1 12h5m13 0h5" />
  </svg>
);

export const DevIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
    <path d="M8 4V2h8v2" />
    <circle cx={10} cy={10} r={1} fill="currentColor" />
    <path d="M14 10h0" />
  </svg>
);

export const ExternalLinkIcon: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="8" y1="16" x2="21" y2="3" />
  </svg>
);
