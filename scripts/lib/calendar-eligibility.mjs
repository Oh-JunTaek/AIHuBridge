import { retainedEvents } from '../../src/lib/calendar-rules.mjs';
import { isAccessibleFromKorea } from '../../src/lib/calendar-audience.mjs';

// 수집 성공·부분 실패에서 합친 기존 자료에도 같은 공개 기준을 적용한다.
export function selectPublishableEvents(events, now = Date.now()) {
  return retainedEvents(events.filter(isAccessibleFromKorea), now);
}
