import { useCallback, useEffect, useRef } from 'react';

export function useAnimatedDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.classList.remove('is-closing');
      dialog.showModal();
    } else if (!open && dialog.open) {
      clearTimeout(timer.current);
      dialog.close();
    }
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const requestClose = useCallback(() => {
    const dialog = ref.current;
    if (!dialog?.open || dialog.classList.contains('is-closing')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.close();
      return;
    }
    dialog.classList.add('is-closing');
    timer.current = setTimeout(() => {
      dialog.close();
      dialog.classList.remove('is-closing');
    }, 180);
  }, []);

  return { ref, requestClose };
}
