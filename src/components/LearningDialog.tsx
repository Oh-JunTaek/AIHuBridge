import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';

export function LearningDialog({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  useEffect(() => {
    if (open && ref.current && !ref.current.open) ref.current.showModal();
    if (!open && ref.current?.open) ref.current.close();
  }, [open]);
  return <dialog ref={ref} className="qualification-dialog" aria-labelledby={headingId} onClose={onClose}>
    <div className="qualification-dialog-inner">
      <div className="qualification-dialog-heading"><div><span>학습 자료 상세 안내</span><h2 id={headingId}>{title}</h2></div><button type="button" className="qualification-close" aria-label="상세 안내 닫기" onClick={() => ref.current?.close()}>×</button></div>
      {children}
    </div>
  </dialog>;
}
