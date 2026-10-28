import { useCallback, useEffect, useState } from 'react';
import type { NewsResult } from '../types';
import { loadNewsResult } from './news';

export function useNews() {
  const [result, setResult] = useState<NewsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60000); return () => window.clearInterval(timer); }, []);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    void loadNewsResult(controller.signal).then((next) => {
      if (controller.signal.aborted) return;
      setResult(next);
      setLoading(false);
    });
    return () => controller.abort();
  }, [revision]);
  return { result, loading, reload, now };
}
