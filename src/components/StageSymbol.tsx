type StageKind = 'foundation' | 'try' | 'certify' | 'expert';

export function StageSymbol({ kind }: { kind: StageKind }) {
  return <svg className="stage-symbol" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    <rect x="1" y="1" width="30" height="30" rx="10" className="stage-symbol-bg" />
    {kind === 'foundation' && <><path d="M16 24v-9m0 4c-5 0-7-3-7-7 4 0 7 2 7 6m0-1c0-4 2-7 7-8 0 5-2 8-7 8" /></>}
    {kind === 'try' && <><path d="M9 21l3-8 10-4-4 10-9 2z" /><circle cx="17" cy="14" r="1.5" /><path d="M10 22l-2 3m5-3-1 3" /></>}
    {kind === 'certify' && <><circle cx="16" cy="14" r="6" /><path d="M12 20l-1 5 5-2 5 2-1-5m-6-6 1.5 1.5 3-3" /></>}
    {kind === 'expert' && <><path d="M10 23v-4c-2-1-3-3-3-5a7 7 0 0114-1c3 1 4 4 4 6h-4v4H10z" /><path d="M13 13l2-2 3 1 1 3-2 2-3-1z" /></>}
  </svg>;
}
