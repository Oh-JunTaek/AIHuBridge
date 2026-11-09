const koreanCities = /^(?:서울|부산|인천|대구|대전|광주|울산|세종|수원|성남|판교|시흥|용인|고양|경기|강원|충청|전라|경상|제주|seoul|busan|incheon|daegu|daejeon|gwangju|ulsan|sejong|suwon|seongnam|pangyo|siheung|yongin|goyang|jeju)(?:$|\b|[\s-]|특별시|광역시|특별자치시|특별자치도|시|구|군|도)/i;
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

// 개최 장소와 참여 방식의 근거만 사용한다. 주최자·커뮤니티 좌표로 행사장을 추정하지 않는다.
export function isAccessibleFromKorea(event) {
  const text = `${event.title ?? ''} ${event.dateEvidence ?? ''} ${(event.topics ?? []).join(' ')}`;
  if (/\b(?:US|USA|United States|UK)[\s-]+(?:residents?[\s-]+)?only\b|한국(?:에서|인)?\s*(?:참가|참여|접속)\s*(?:불가|제한)/i.test(text)) return false;
  if (event.isOnline === true) return true;
  if (event.isOnline !== false) return false;
  const venue = (event.location ?? '').trim();
  return koreanCities.test(venue) || koreanCountries.has(venue.toLowerCase());
}

const cityAliases = [['서울', 'seoul'], ['부산', 'busan'], ['인천', 'incheon'], ['대구', 'daegu'], ['대전', 'daejeon'], ['광주', 'gwangju'], ['울산', 'ulsan'], ['세종', 'sejong'], ['수원', 'suwon'], ['성남', 'seongnam'], ['판교', 'pangyo'], ['용인', 'yongin'], ['고양', 'goyang'], ['제주', 'jeju']];
export function matchesRegion(event, query) {
  const normalize = (value) => cityAliases.reduce((text, [ko, en]) => text.replaceAll(ko, en), value.toLocaleLowerCase());
  return normalize(`${event.host} ${event.location ?? ''} ${event.region ?? ''}`).includes(normalize(query.trim()));
}

// 실제 행사 장소만 사용하며 주최 커뮤니티 위치로 개최지를 추정하지 않는다.
export function matchesCalendarRegion(event, region) {
  if (region === 'all') return true;
  if (region === 'online') return event.isOnline === true;
  const location = (event.location ?? '').trim().toLowerCase();
  const patterns = {
    seoul: /^(서울|seoul)(?:$|[\s,\-]|특별시)/i,
    gyeonggi: /^(경기|gyeonggi|수원|suwon|성남|seongnam|판교|pangyo|시흥|siheung|용인|yongin|고양|goyang)(?:$|[\s,\-]|도|시|구)/i,
    busan: /^(부산|busan)(?:$|[\s,\-]|광역시)/i,
    incheon: /^(인천|incheon)(?:$|[\s,\-]|광역시)/i,
    daegu: /^(대구|daegu)(?:$|[\s,\-]|광역시)/i,
    daejeon: /^(대전|daejeon)(?:$|[\s,\-]|광역시)/i,
    gwangju: /^(광주|gwangju)(?:$|[\s,\-]|광역시)/i,
    ulsan: /^(울산|ulsan)(?:$|[\s,\-]|광역시)/i,
    sejong: /^(세종|sejong)(?:$|[\s,\-]|특별자치시)/i,
  };
  // 단독 광주는 경기 광주시와 광주광역시를 구별할 수 없다.
  if (region === 'gwangju' && /^(광주|gwangju)(?:$|[\s,\-])/i.test(location)) return false;
  return Boolean(patterns[region]?.test(location));
}

