// 자격 발급 기관의 상표가 아닌 분야별 자체 안내 그림이다.
export function QualificationFieldIcon({ field }: { field: string }) {
  const shape: Record<string, React.ReactNode> = {
    QA: <><rect x="5" y="4" width="14" height="16" rx="2" /><path d="m8 10 2 2 4-4M8 16h8" /></>,
    보안: <><path d="M12 3 19 6v5c0 4-3 7-7 10-4-3-7-6-7-10V6z" /><path d="m9 12 2 2 4-4" /></>,
    데이터: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" /></>,
    클라우드: <path d="M7 18h10a4 4 0 0 0 .4-8A5.5 5.5 0 0 0 7 9a4.5 4.5 0 0 0 0 9Z" />,
    '컴퓨터 활용': <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
    개발: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-12-4 14" /></>,
    AI: <><rect x="6" y="6" width="12" height="12" rx="3" /><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4M10 10h4v4h-4z" /></>,
  };
  return <svg className="qualification-field-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{shape[field] ?? shape.AI}</svg>;
}
