import { useEffect } from 'react';
import { useCalendarStore } from '../lib/calendar';

export default function Calendar() {
  const { events, status, loadEvents, getDDay, filter } = useCalendarStore();

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // 마감임박순 정렬
  const now = Date.now();
  const sorted = [...events].sort((a, b) => {
    const aEnd = a.applicationEnd ? new Date(a.applicationEnd).getTime() - now : Infinity;
    const bEnd = b.applicationEnd ? new Date(b.applicationEnd).getTime() - now : Infinity;
    return aEnd - bEnd;
  });

  const recruiting = filter({ status: ['recruiting'] });
  const upcoming = filter({ status: ['open'] });
  const completed = filter({ status: ['completed'] });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">AI 교육·행사 캘린더</h1>
      <p className="text-sm text-stone-500 mb-6">
        정부·기업·커뮤니티에서 진행하는 AI 교육, 워크숍, 해커톤, 공모전 등을 확인하세요.
        <br />
        마감 임박순으로 정렬됩니다.
      </p>

      {status === 'loading' && (
        <p className="text-center py-10 text-stone-400">⏳ 캘린더 정보를 불러오는 중…</p>
      )}

      {status === 'error' && (
        <p className="text-center py-10 text-rose-500">⚠️ 캘린더 정보를 불러오지 못했습니다.</p>
      )}

      {status === 'idle' && sorted.length === 0 && (
        <p className="text-center py-10 text-stone-400">📭 예정된 AI 교육/행사가 없습니다.</p>
      )}

      {/* 요약 통계 */}
      {sorted.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-amber-50 rounded-lg py-3">
            <div className="text-2xl font-bold text-amber-600">{recruiting.length}</div>
            <div className="text-xs text-stone-500">모집 중</div>
          </div>
          <div className="bg-cyan-50 rounded-lg py-3">
            <div className="text-2xl font-bold text-cyan-600">{upcoming.length}</div>
            <div className="text-xs text-stone-500">예정/진행 중</div>
          </div>
          <div className="bg-stone-100 rounded-lg py-3">
            <div className="text-2xl font-bold text-stone-600">{completed.length}</div>
            <div className="text-xs text-stone-500">종료</div>
          </div>
        </div>
      )}

      {/* 목록 */}
      <div className="space-y-4">
        {sorted.map((e) => {
          const dday = getDDay(e.applicationEnd);
          return (
            <div
              key={e.id}
              className="border border-stone-200 dark:border-stone-700 rounded-xl p-5 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-stone-800 dark:text-stone-200">
                  {e.title}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                    e.status === 'recruiting'
                      ? 'bg-amber-100 text-amber-800'
                      : e.status === 'open'
                      ? 'bg-cyan-100 text-cyan-800'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {e.status === 'recruiting' ? '모집 중' : e.status === 'open' ? '진행 중' : '종료'}
                </span>
              </div>

              <div className="text-sm text-stone-600 dark:text-stone-300 space-y-1">
                <p>🏛️ <strong>{e.host}</strong> · {e.type}</p>
                <p>
                  📅{' '}
                  {e.applicationEnd ? (
                    <span>
                      신청 마감: {new Date(e.applicationEnd).toLocaleDateString('ko-KR')}{' '}
                      <strong className="text-amber-600">{dday?.label ?? '마감일 미정'}</strong>
                    </span>
                  ) : (
                    '마감일 미확인'
                  )}
                </p>
                {e.eventStart && (
                  <p>
                    🎤 행사일: {new Date(e.eventStart).toLocaleDateString('ko-KR')}
                  </p>
                )}
                <p>
                  📍 {e.isOnline ? '온라인' : '오프라인'} · {e.location}
                </p>
                <p>
                  💰 {e.feeType === 'free' ? '무료' : `${e.feeAmount?.toLocaleString()}원`}
                </p>
              </div>

              {e.url && (
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-amber-600 hover:text-amber-800 hover:underline"
                >
                  📎 공식 신청 링크 →
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
