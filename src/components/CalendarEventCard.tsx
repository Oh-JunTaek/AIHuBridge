import type { CalendarEvent } from '../types';
import { deadlineLabel, eventStatusLabel } from '../lib/calendar-rules.mjs';
import { eventTerritory } from '../lib/calendar-audience.mjs';

export const eventTypeLabels = { seminar: '세미나', webinar: '웨비나', workshop: '워크숍', bootcamp: '부트캠프', hackathon: '해커톤', competition: '공모전', training: '교육', conference: '컨퍼런스', meetup: '밋업', other: '기타 AI 행사' };
const format = (value: string) => new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export function CalendarEventCard({ event, now }: { event: CalendarEvent; now: number }) {
  return (
          <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900">
            <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:gap-3">
              <h3 className="min-w-0 break-words font-semibold text-stone-800 dark:text-stone-200">{event.title}</h3>
              <span className="shrink-0 rounded-full bg-sky-50 px-2 py-1 text-[10px] text-sky-800 dark:bg-sky-950 dark:text-sky-200">{eventStatusLabel(event, now)}</span>
            </div>
            <div className="space-y-1 text-sm text-stone-600 dark:text-stone-300">
              <p>{event.host} · {eventTypeLabels[event.type]}</p>
              <p className="text-xs">지역 구분: {{ domestic: '국내', overseas: '해외', unknown: '미확인' }[eventTerritory(event)]}{event.territoryBasis === 'community-location' ? ' · 주최 커뮤니티 위치 기준' : ' · 공개 도시·기관 표기 기준'}</p>
              {event.applicationStart && <p>신청 시작: {format(event.applicationStart)}</p>}
              <p>신청 마감: {event.applicationEnd ? <>{format(event.applicationEnd)} · <strong>{deadlineLabel(event.applicationEnd, now)?.label}</strong></> : '미확인 · 원문에서 확인'}</p>
              {event.scheduleUnknown && <p className="font-semibold text-amber-700 dark:text-amber-300">변경 일정 미확인 · 아래 날짜는 변경 전 참고 일정입니다.</p>}
              <p>{event.scheduleUnknown ? '기존 행사 일정' : '행사 일정'}: {event.eventStart ? format(event.eventStart) + ' (한국시간)' : event.eventDate ? event.eventDate + (event.eventEndDate && event.eventEndDate !== event.eventDate ? ' ~ ' + event.eventEndDate : '') + ' (현지 날짜·시각 미확인)' : '미확인'}</p>
              <p>진행 방식: {event.isOnline === null ? '미확인' : event.isOnline ? '온라인' : '오프라인'}{event.location ? ' · ' + event.location : ''}</p>
              <p>참가 비용: {event.feeType === 'unknown' ? '미확인' : event.feeType === 'free' ? '무료' : event.feeAmount === null ? '유료 (금액 미확인)' : event.feeAmount.toLocaleString('ko-KR') + '원'}</p>
              <p className="text-xs">일정 근거: {event.dateEvidence}</p>
              <p className="text-xs">항목 마지막 수집: {format(event.fetchedAt)} · 원문에서 변경 여부 확인</p>
              {event.topics && event.topics.length > 0 && <p className="text-xs">주제: {event.topics.join(' · ')}</p>}
              <p className="text-xs">{event.verification === 'manual' && event.confirmedAt ? '내용 확인: ' + format(event.confirmedAt) : event.verification === 'public-event' ? '공개 커뮤니티 일정 · 신청 가능 여부는 원문 확인' : 'RSS 공고에 명시된 일정 · 수동 확인 전'}</p>
            </div>
            <a href={event.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-amber-700 underline dark:text-amber-300">원문 공고 확인 →</a>
            {event.sourceUrl && <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-4 text-xs underline">일정 제공처</a>}
          </article>
  );
}
