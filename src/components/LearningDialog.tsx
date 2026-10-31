import { useId } from 'react';
import type { ReactNode } from 'react';
import { useAnimatedDialog } from './useAnimatedDialog';

export function LearningDialog({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: ReactNode }) {
  const { ref, requestClose } = useAnimatedDialog(open);
  const headingId = useId();
  return <dialog ref={ref} className="qualification-dialog" aria-labelledby={headingId} onClose={onClose} onCancel={(event) => { event.preventDefault(); requestClose(); }}>
    <div className="qualification-dialog-inner">
      <div className="qualification-dialog-heading"><div><span>학습 자료 상세 안내</span><h2 id={headingId}>{title}</h2></div><button type="button" className="qualification-close" aria-label="상세 안내 닫기" onClick={requestClose}>×</button></div>
      {children}
    </div>
  </dialog>;
}
