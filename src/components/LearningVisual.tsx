type LearningVisualKind = 'course' | 'practice' | 'project' | 'platform' | 'assessment' | 'certificate';

// 기관 로고가 아닌 자료 유형을 나타내는 장식이다.
export function LearningVisual({ kind }: { kind: LearningVisualKind }) {
  return <span className={`learning-visual learning-visual-${kind}`} aria-hidden="true">
    <svg viewBox="0 0 112 76" fill="none">
      {kind === 'certificate' ? <>
        <rect x="27" y="9" width="52" height="55" rx="5" fill="#fff" stroke="#9abbd0" strokeWidth="2" />
        <path d="M38 23h30M38 31h23M38 39h18" stroke="#aac7d9" strokeWidth="3" strokeLinecap="round" />
        <circle cx="68" cy="49" r="9" fill="#dbb579" /><path d="m63 56-2 11 7-4 7 4-2-11" fill="#91b3ca" />
      </> : kind === 'course' ? <>
        <rect x="19" y="10" width="73" height="48" rx="6" fill="#fff" stroke="#a4c4d8" strokeWidth="2" />
        <circle cx="55" cy="34" r="13" fill="#e0eef7" /><path d="m52 27 10 7-10 7z" fill="#6294b7" />
        <path d="M38 65h35" stroke="#c6a778" strokeWidth="3" strokeLinecap="round" />
      </> : kind === 'platform' ? <>
        <rect x="18" y="12" width="76" height="49" rx="7" fill="#fff" stroke="#9dbfd4" strokeWidth="2" />
        <path d="M18 24h76" stroke="#d2e4ee" strokeWidth="2" /><circle cx="26" cy="18" r="2" fill="#d9b578" /><circle cx="33" cy="18" r="2" fill="#a6c8db" />
        <rect x="27" y="32" width="17" height="19" rx="3" fill="#dcecf5" /><path d="M51 34h29M51 41h23M51 48h27" stroke="#b2cddd" strokeWidth="3" strokeLinecap="round" />
      </> : kind === 'assessment' ? <>
        <rect x="29" y="9" width="54" height="57" rx="6" fill="#fff" stroke="#a6c4d5" strokeWidth="2" />
        {[25, 37, 49].map(y => <g key={y}><circle cx="41" cy={y} r="4" fill="#dceef6" /><path d={`M39 ${y}l1.5 1.5 3-3`} stroke="#6299b8" strokeWidth="1.5"/><path d={`M50 ${y}h20`} stroke="#b8cfdd" strokeWidth="3" strokeLinecap="round" /></g>)}
      </> : <>
        <rect x="16" y="10" width="80" height="49" rx="7" fill="#fff" stroke="#9fbfd2" strokeWidth="2" />
        <path d="M16 22h80" stroke="#d4e5ee" strokeWidth="2" /><circle cx="24" cy="16" r="2" fill="#d9b578" />
        {kind === 'practice' ? <><path d="m42 33-6 5 6 5m17-10 6 5-6 5M54 30l-5 16" stroke="#79a4be" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></> : <><rect x="31" y="31" width="13" height="13" rx="3" fill="#a9cde0" /><rect x="50" y="31" width="13" height="13" rx="3" fill="#e3c697" /><rect x="69" y="31" width="13" height="13" rx="3" fill="#a9cde0" /><path d="M44 38h6m13 0h6" stroke="#8bb1c8" strokeWidth="2" /></>}
        <path d="M35 66h42" stroke="#d0b187" strokeWidth="3" strokeLinecap="round" />
      </>}
    </svg>
  </span>;
}
