import type { NewsResult } from '../types';

export function NewsStatus({ result, loading, onRetry }: { result: NewsResult | null; loading: boolean; onRetry: () => void }) {
  return (
    <div className="mb-5 space-y-2 text-sm text-stone-600 dark:text-stone-300">
      {loading ? <p role="status">뉴스를 불러오는 중입니다…</p> : <>
        {result?.status === 'error' && <div role="alert"><p>{result.error}</p><button type="button" onClick={onRetry} className="mt-2 rounded border border-stone-300 px-3 py-1 underline dark:border-stone-600">다시 시도</button></div>}
        {result?.status === 'empty' && <p role="status">현재 등록된 뉴스가 없습니다.</p>}
        {result?.warning && <p role="status" className="text-amber-700 dark:text-amber-300">{result.warning}</p>}
      </>}
      {result?.fetchedAt && <p className="text-xs">마지막 수집: {new Date(result.fetchedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} (한국시간)</p>}
    </div>
  );
}
