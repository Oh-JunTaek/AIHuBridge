// 명시적인 상세 주소와 일반 링크 이동은 보존하고, 목록을 새로고침할 때만 선택을 초기화한다.
export function resetJourneyFiltersOnReload(href, baseUrl, navigationType) {
  if (navigationType !== 'reload') return null;
  const url = new URL(href);
  const basePath = new URL(baseUrl, url.origin).pathname.replace(/\/$/, '');
  if (url.pathname.replace(/\/$/, '') !== `${basePath}/path` || url.searchParams.has('journey')) return null;
  if (!url.searchParams.has('purpose') && !url.searchParams.has('topic')) return null;
  url.searchParams.delete('purpose');
  url.searchParams.delete('topic');
  return `${url.pathname}${url.search}${url.hash}`;
}
