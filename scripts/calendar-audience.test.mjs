import test from 'node:test';
import assert from 'node:assert/strict';
import { eventTerritory, matchesAudience } from '../src/lib/calendar-audience.mjs';
import { communityRegion } from './lib/community-region.mjs';
const event = { host: 'GDG on Campus Example - London, United Kingdom', location: 'London', isOnline: false };

test('국내 기본 화면에 해외 온라인 포함, 해외 오프라인 제외', () => {
  assert.equal(matchesAudience(event), false);
  assert.equal(matchesAudience({ ...event, isOnline: true }), true);
  assert.equal(matchesAudience({ ...event, isOnline: null }), false);
  assert.equal(matchesAudience({ ...event, location: '서울' }), true);
});
test('도시·국가 명시와 미확인 분류를 구분하며 제목 언어는 무관', () => {
  assert.equal(eventTerritory(event), 'overseas');
  assert.equal(eventTerritory({ ...event, location: 'Seoul' }), 'domestic');
  assert.equal(eventTerritory({ ...event, location: null, host: '한국어로 된 이름' }), 'unknown');
  assert.equal(eventTerritory({ ...event, location: null, host: 'GDG Campus, South Korea' }), 'domestic');
});
test('미확인 온라인도 이용 가능 기준으로 국내 화면에 포함하되 지역 자체는 추정하지 않음', () => {
  const online = { host: '공개 커뮤니티', location: null, isOnline: true };
  assert.equal(eventTerritory(online), 'unknown');
  assert.equal(matchesAudience(online), true);
  assert.equal(matchesAudience(online, 'overseas'), false);
  assert.equal(matchesAudience(online, 'unknown'), true);
});
test('전체·해외 필터는 선택 기준대로 동작', () => {
  assert.equal(matchesAudience(event, 'overseas'), true);
  assert.equal(matchesAudience(event, 'all'), true);
  assert.equal(matchesAudience({ ...event, location: '부산' }, 'overseas'), false);
});

test('공개 커뮤니티 위치의 대한민국 경계와 해외·미확인을 구분', () => {
  assert.equal(communityRegion(37.5665, 126.978), 'domestic');
  assert.equal(communityRegion(35.1796, 129.0756), 'domestic');
  assert.equal(communityRegion(33.4996, 126.5312), 'domestic');
  assert.equal(communityRegion(51.5074, -0.1278), 'overseas');
  assert.equal(communityRegion(null, null), 'unknown');
  assert.equal(communityRegion(0, 0), 'unknown');
  assert.equal(communityRegion(400, 300), 'unknown');
});
