const koreanCities = /^(?:서울|부산|인천|대구|대전|광주|울산|세종|수원|성남|판교|시흥|용인|고양|경기|강원|충청|전라|경상|제주|seoul|busan|incheon|daegu|daejeon|gwangju|ulsan|sejong|suwon|seongnam|pangyo|siheung|yongin|goyang|jeju)(?:$|\b|[\s-]|시|구|군|도)/i;
const koreanCountries = new Set(['south korea', 'republic of korea', 'korea, republic of', '대한민국', '한국']);
// 제공처가 커뮤니티명 끝에 명시한 국가명만 해석한다. 자료 언어나 행사 제목으로 국적을 추정하지 않는다.
const countryNames = new Set(['turkey', 'taiwan', 'vietnam', 'united states', 'united kingdom', 'russia']);
const names = new Intl.DisplayNames(['en'], { type: 'region' });
for (let a = 65; a <= 90; a++) for (let b = 65; b <= 90; b++) {
  const code = String.fromCharCode(a, b), name = names.of(code);
  if (name && name !== code && code !== 'ZZ') countryNames.add(name.toLowerCase());
}

export function eventTerritory(event) {
  const city = (event.location ?? event.region ?? '').trim();
  if (koreanCities.test(city)) return 'domestic';
  if (['domestic', 'overseas'].includes(event.territory)) return event.territory;
  const hostCountry = event.host?.split(',').at(-1)?.trim().toLowerCase();
  if (koreanCountries.has(hostCountry)) return city ? 'unknown' : 'domestic';
  if (countryNames.has(hostCountry)) return 'overseas';
  return 'unknown';
}

export function matchesAudience(event, audience = 'domestic') {
  if (audience === 'all') return true;
  const territory = eventTerritory(event);
  // 국내 이용자를 위한 기본 화면에는 지역과 무관하게 온라인으로 확인된 행사도 포함한다.
  if (audience === 'domestic') return territory === 'domestic' || event.isOnline === true;
  return territory === audience;
}

