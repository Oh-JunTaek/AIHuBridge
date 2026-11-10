import test from 'node:test';
import assert from 'node:assert/strict';
import { collectCoexEvents, parseCoexList } from './lib/coex-events.mjs';
import { selectPublishableEvents } from './lib/calendar-eligibility.mjs';

const now = Date.parse('2026-11-10T00:00:00Z');
const row = (title = 'AI 콘텐츠 페스티벌', date = '2026.11.12 - 2026.11.14', hall = 'The Platz', url = 'https://www.coex.co.kr/exhibitions/test/?var_page=1') =>
  `<li class='BlogPost-item'><a href='${url}' class='BlogEventItem-link'><h4 class='BlogEventItemCont-tit'>${title}</h4><div class='BlogEventItemCont-date'>${date}</div><div class='BlogEventItemCont-hall'>${hall}</div></a></li>`;
const page = (rows, next = 1) => `<ul class="BlogPost-list">${rows}</ul><span class='PagingList-link PagingList-current'>1</span><a href='https://www.coex.co.kr/event/full-schedules/?var_page=${next}&amp;list_type=LIST' class='PagingNextButton-link'>다음</a>`;

test('공식 목록에서 제목에 AI 근거가 있는 국내 현장 행사만 수집한다', async () => {
  const result = await collectCoexEvents([], now, async () => page(row() + row('2026 블록체인') + row('AI 해외', '2026.11.12 - 2026.11.14', '장소', 'https://example.com/exhibitions/test/')));
  assert.equal(result.source.status, 'success');
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].eventDate, '2026-11-12');
  assert.equal(result.events[0].eventEndDate, '2026-11-14');
  assert.equal(result.events[0].applicationEnd, null);
  assert.equal(result.events[0].eventStart, null);
  assert.equal(result.events[0].isOnline, false);
  assert.equal(result.events[0].location, '서울 코엑스 · The Platz');
  assert.equal(result.events[0].url, 'https://www.coex.co.kr/exhibitions/test/');
  assert.equal(selectPublishableEvents(result.events, now).length, 1);
});

test('잘못된 날짜, 기한 역전과 불명확한 AI 제목은 제외한다', async () => {
  const result = await collectCoexEvents([], now, async () => page(row('AI 행사', '2026.02.30 - 2026.03.01') + row('AI 행사', '2026.11.14 - 2026.11.12') + row('BLOCKCHAIN 행사')));
  assert.equal(result.events.length, 0);
});

test('일부 페이지만 읽으면 부분 수집으로 기록한다', async () => {
  const result = await collectCoexEvents([], now, async () => page(row(), 2));
  assert.equal(result.source.status, 'partial');
  assert.equal(result.events.length, 1);
});

test('정상 빈 목록과 구조 오류를 구별하고 오류 때 기존 행사를 보존한다', async () => {
  const initial = await collectCoexEvents([], now, async () => page(row()));
  const empty = await collectCoexEvents(initial.events, now, async () => page("<li class='BlogPost-item'><p class='nopost'>검색 결과가 없습니다.</p></li>"));
  assert.equal(empty.source.status, 'success');
  assert.equal(empty.events.length, 1);
  const failed = await collectCoexEvents(initial.events, now, async () => '<html>오류</html>');
  assert.equal(failed.source.status, 'error');
  assert.equal(failed.events.length, 1);
  assert.throws(() => parseCoexList(page("<li class='BlogPost-item'>형식 변경</li>")));
});

test('목록에 같은 원문이 반복돼도 한 건으로 유지한다', async () => {
  const result = await collectCoexEvents([], now, async () => page(row() + row()));
  assert.equal(result.events.length, 1);
});

test('같은 원문이 더 이상 AI 행사가 아니면 예전 자료를 재노출하지 않는다', async () => {
  const initial = await collectCoexEvents([], now, async () => page(row()));
  const changed = await collectCoexEvents(initial.events, now, async () => page(row('일반 문화 행사')));
  assert.equal(changed.events.length, 0);
});
