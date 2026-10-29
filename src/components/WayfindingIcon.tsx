import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { direction?: 'right' | 'left' | 'external' };

/** 전시관 안내 표식: 링크 방향만 보조하고 이름은 주변 텍스트가 제공한다. */
export function WayfindingIcon({ direction = 'right', className = '', ...props }: Props) {
  return <svg viewBox="0 0 28 28" className={`wayfinding-icon ${className}`} fill="none" aria-hidden="true" focusable="false" {...props}>
    <circle cx="14" cy="14" r="12.1" className="wayfinding-ring" />
    {direction === 'external' ? <path d="M9.5 18.5l9-9m-6 .1h6v6" /> : direction === 'left' ? <path d="M18.5 14h-9m3.5-3.5L9.5 14l3.5 3.5" /> : <path d="M9.5 14h9m-3.5-3.5 3.5 3.5-3.5 3.5" />}
  </svg>;
}
