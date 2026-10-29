import { useEffect, useRef } from 'react';

interface Props {
  visible: number;
  total: number;
  label: string;
  onLoad: () => void;
}

/** 화면 아래에 가까워지면 이미 받아온 목록의 다음 묶음을 표시한다. */
export function AutoLoadMore({ visible, total, label, onLoad }: Props) {
  const marker = useRef<HTMLDivElement>(null);
  const loadRef = useRef(onLoad);
  loadRef.current = onLoad;
  const remaining = Math.max(0, total - visible);

  useEffect(() => {
    const element = marker.current;
    if (!element || remaining === 0) return;
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      loadRef.current();
    };
    if (typeof window.IntersectionObserver === 'function') {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) { observer.disconnect(); load(); }
      }, { rootMargin: '0px 0px 320px 0px' });
      observer.observe(element);
      return () => observer.disconnect();
    }
    const check = () => { if (element.getBoundingClientRect().top <= window.innerHeight + 320) load(); };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, [remaining, visible]);

  return <div ref={marker} className="auto-load-marker" role="status" aria-live="polite"
    tabIndex={remaining ? 0 : undefined} onFocus={remaining ? () => loadRef.current() : undefined}>
    {remaining > 0 ? `${label} ${remaining}건이 남아 있습니다. 이어서 표시합니다.` : total > 0 ? `${label}을 모두 표시했습니다.` : ''}
  </div>;
}
