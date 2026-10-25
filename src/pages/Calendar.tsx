import { useEffect, useState } from 'react';
import { useCalendarStore } from '../lib/calendar';
import { visibleEvents } from '../lib/calendar-rules.mjs';

const typeLabels = { seminar: '세미나', webinar: '웨비나', workshop: '워크숍', bootcamp: '부트캠프', hackathon: '해커톤', competition: '공모전', training: '교육' };
const format = (value: string) => new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function Calendar() {
  const { events, meta, status, loadEvents, getDDay } = useCalendarStore();
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    void loadEvents();
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [loadEvents]);
  // 페이지를 열어 둔 상태에서도 마감된 항목을 제거한다.
  const shown = visibleEvents(events, now);
  const stale = !meta || now - Date.parse(meta.fetchedAt) > 36 * 3600000;
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-stone-800 dark:text-stone-100">AI 교육·행사 캘린더</h1>
      <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">신청 마감일이 확인된 모집 중·모집 예정 공고를 마감 임박순으로 안내합니다. 모든 일정은 한국시간 기준입니다.</p>
      {meta && <p className="mb-3 text-xs text-stone-500">마지막 수집: {format(meta.fetchedAt)}</p>}
      {status === 'loading' && <p role="status">행사 정보를 불러오는 중입니다…</p>}
      {status === 'error' && <div role="alert" className="mb-4 text-sm text-rose-600">행사 정보를 갱신하지 못했습니다. <button type="button" className="underline" onClick={() => void loadEvents()}>다시 시도</button></div>}
      {status !== 'loading' && (stale || meta?.status === 'partial' || meta?.status === 'cleaned') && (
        <p role="status" className="mb-4 text-sm text-amber-700 dark:text-amber-300">{meta?.status === 'cleaned' ? '기존의 부정확한 공고를 정리했습니다. 다음 수집에서 확인된 공고를 안내합니다.' : '수집 정보가 오래되었거나 일부 출처를 확인하지 못했습니다. 신청 전에 원문을 확인하세요.'}</p>
      )}
      {status === 'idle' && !shown.length && <p className="py-8 text-sm text-stone-500">현재 마감일이 확인된 모집 공고가 없습니다. 마감된 공고와 일정 미확인 자료는 표시하지 않습니다.</p>}
      <div className="space-y-4">
        {shown.map((event) => (
          <article key={event.id} className="rounded-xl border border-stone-200 p-5 dark:border-stone-700">
            <div className="mb-2 flex items-start justify-between gap-3">
              <h2 className="font-semibold text-stone-800 dark:text-stone-200">{event.title}</h2>
              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">{event.status === 'scheduled' ? '모집 예정' : '모집 중'}</span>
            </div>
            <div className="space-y-1 text-sm text-stone-600 dark:text-stone-300">
              <p>{event.host} · {typeLabels[event.type]}</p>
              {event.applicationStart && <p>신청 시작: {format(event.applicationStart)}</p>}
              <p>신청 마감: {format(event.applicationEnd!)} · <strong>{getDDay(event.applicationEnd, now)?.label}</strong></p>
              <p>행사 일정: {event.eventStart ? format(event.eventStart) : '미확인'}</p>
              <p>진행 방식: {event.isOnline === null ? '미확인' : event.isOnline ? '온라인' : '오프라인'}{event.location ? ' · ' + event.location : ''}</p>
              <p>참가 비용: {event.feeType === 'unknown' ? '미확인' : event.feeType === 'free' ? '무료' : event.feeAmount === null ? '유료 (금액 미확인)' : event.feeAmount.toLocaleString('ko-KR') + '원'}</p>
              <p className="text-xs">마감일 근거: {event.dateEvidence}</p>
              <p className="text-xs">{event.verification === 'manual' && event.confirmedAt ? '내용 확인: ' + format(event.confirmedAt) : 'RSS 공고에 명시된 일정 · 수동 확인 전'}</p>
            </div>
            <a href={event.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-amber-700 underline dark:text-amber-300">원문 공고 확인 →</a>
          </article>
        ))}
      </div>
    </div>
  );
}
