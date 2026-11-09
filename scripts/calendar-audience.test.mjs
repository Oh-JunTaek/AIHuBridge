import test from 'node:test';
import assert from 'node:assert/strict';
import { eventTerritory, isAccessibleFromKorea, matchesRegion } from '../src/lib/calendar-audience.mjs';
import { communityRegion } from './lib/community-region.mjs';
const event = { host: 'GDG on Campus Example - London, United Kingdom', location: 'London', isOnline: false };

test('국내에서 참석 가능한 근거가 있는 행사만 허용한다', () => {
  assert.equal(isAccessibleFromKorea(event), false);
  assert.equal(isAccessibleFromKorea({ ...event, isOnline: true }), true);
  assert.equal(isAccessibleFromKorea({ ...event, isOnline: null }), false);
  assert.equal(isAccessibleFromKorea({ ...event, location: '서울', isOnline: false }), true);
  assert.equal(isAccessibleFromKorea({ ...event, location: '서울', isOnline: null }), false);
  assert.equal(isAccessibleFromKorea({ ...event, host: 'NVIDIA Korea', location: null, isOnline: null }), false);
  assert.equal(isAccessibleFromKorea({ ...event, host: 'GDG Seoul, South Korea', location: null, territory: 'domestic', territoryBasis: 'community-location', isOnline: false }), false);
  assert.equal(isAccessibleFromKorea({ ...event, location: 'Cairo', isOnline: false }), false);
  assert.equal(isAccessibleFromKorea({ ...event, title: 'Online AI summit — US residents only', isOnline: true }), false);
  assert.equal(isAccessibleFromKorea({ ...event, title: '온라인 AI 행사 한국 참가 불가', isOnline: true }), false);
  assert.equal(isAccessibleFromKorea({ ...event, title: '온라인 AI 행사 한국에서 접속 불가', isOnline: true }), false);
  assert.equal(isAccessibleFromKorea({ ...event, title: 'Online AI event - US-only', isOnline: true }), false);
});
test('도시·국가 명시와 미확인 분류를 구분하며 제목 언어는 무관', () => {
  assert.equal(eventTerritory(event), 'overseas');
  assert.equal(eventTerritory({ ...event, location: 'Seoul' }), 'domestic');
  assert.equal(eventTerritory({ ...event, location: null, host: '한국어로 된 이름' }), 'unknown');
  assert.equal(eventTerritory({ ...event, location: null, host: 'GDG Campus, South Korea' }), 'domestic');
});

test('지역 검색은 서울·Seoul 등 한영 도시명을 같은 지역으로 검색한다', () => {
  assert.equal(matchesRegion({ ...event, location: 'Seoul' }, '서울'), true);
  assert.equal(matchesRegion({ ...event, location: '서울 강남구' }, 'seoul'), true);
  assert.equal(matchesRegion({ ...event, location: 'Busan' }, '부산'), true);
  assert.equal(matchesRegion(event, '서울'), false);
  assert.equal(matchesRegion(event, ''), true);
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
