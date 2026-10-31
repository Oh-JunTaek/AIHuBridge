/** 공간으로 이어지는 방향을 나타내는 장식용 표식. */
export function PassageMark({ className = '' }: { className?: string }) {
  return <svg className={`passage-mark ${className}`} viewBox="0 0 32 16" fill="none" aria-hidden="true" focusable="false">
    <path className="passage-mark-line" d="M2 8h25" />
    <path d="m21.5 2.5 5.5 5.5-5.5 5.5" />
  </svg>;
}
