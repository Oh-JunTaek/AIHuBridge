import { useEffect, useMemo, useRef, useState } from 'react';
import { WayfindingIcon } from '../components/WayfindingIcon';
import {
  majorChannels,
  mastodonSources,
  parseMastodonFeed,
  parseSocialFeed,
  recentSocialPosts,
  socialSources,
} from '../lib/social-feed.mjs';
import type { SocialPost } from '../lib/social-feed.mjs';

export default function Social() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [failures, setFailures] = useState<string[]>([]);
  const [checks, setChecks] = useState<{ label: string; failed: boolean; count: number }[]>([]);
  const [checkedAt, setCheckedAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [company, setCompany] = useState('');
  const [platform, setPlatform] = useState('');
  const [query, setQuery] = useState('');
  const [days, setDays] = useState('7');
  const [visibleCount, setVisibleCount] = useState(24);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    setPosts([]);
    setFailures([]);
    setChecks([]);
    setCheckedAt(null);

    // 1. 서버 수집 대기업 공식 미디어/영상 데이터 (CORS 없이 즉시 로드)
    const baseUrl = import.meta.env.BASE_URL.replace(/\/?$/, '/');
    const localMediaPromise = fetch(`${baseUrl}data/social.json`, { signal: abort.signal, cache: 'no-cache' })
      .then(async (res) => {
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? (data as SocialPost[]) : [];
      })
      .catch(() => []);

    // 2. 실시간 Bluesky 채널
    const feeds = socialSources.map(async (source) => {
      const url = new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed');
      url.searchParams.set('actor', source.actor);
      url.searchParams.set('limit', '100');
      const request = new AbortController();
      const cancel = () => request.abort();
      abort.signal.addEventListener('abort', cancel, { once: true });
      const timer = window.setTimeout(cancel, 15000);
      try {
        const response = await fetch(url, { signal: request.signal, cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return parseSocialFeed(await response.json(), source);
      } finally {
        window.clearTimeout(timer);
        abort.signal.removeEventListener('abort', cancel);
      }
    });

    // 3. 실시간 Mastodon 채널
    const mastodonFeeds = mastodonSources.map(async (source) => {
      const request = new AbortController();
      const cancel = () => request.abort();
      abort.signal.addEventListener('abort', cancel, { once: true });
      const timer = window.setTimeout(cancel, 15000);
      try {
        const url = new URL(`/api/v1/accounts/${source.accountId}/statuses`, source.origin);
        url.searchParams.set('limit', '40');
        url.searchParams.set('exclude_reblogs', 'true');
        url.searchParams.set('exclude_replies', 'true');
        const response = await fetch(url, { signal: request.signal, cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return parseMastodonFeed(await response.json(), source, (html) =>
          new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''
        );
      } finally {
        window.clearTimeout(timer);
        abort.signal.removeEventListener('abort', cancel);
      }
    });

    const labels = [
      '공식 미디어(YouTube)',
      ...socialSources.map((source) => `@${source.handle} (Bluesky)`),
      ...mastodonSources.map((source) => `@${source.handle} (Mastodon)`),
    ];

    Promise.allSettled([localMediaPromise, ...feeds, ...mastodonFeeds]).then((results) => {
      if (abort.signal.aborted) return;
      const allFetched: SocialPost[] = [];
      const failedLabels: string[] = [];
      const checkResults: { label: string; failed: boolean; count: number }[] = [];

      results.forEach((result, i) => {
        const label = labels[i];
        if (result.status === 'fulfilled') {
          const list = recentSocialPosts(result.value);
          allFetched.push(...list);
          checkResults.push({ label, failed: false, count: list.length });
        } else {
          failedLabels.push(label);
          checkResults.push({ label, failed: true, count: 0 });
        }
      });

      // 중복 제거 및 최신 날짜순 정렬
      const seen = new Set<string>();
      const deduped: SocialPost[] = [];
      for (const p of allFetched.sort((a, b) => b.date.localeCompare(a.date))) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          deduped.push(p);
        }
      }

      setPosts(deduped);
      setFailures(failedLabels);
      setChecks(checkResults);
      setCheckedAt(Date.now());
      setLoading(false);
    });

    return () => abort.abort();
  }, [refresh]);

  useEffect(() => {
    const timer = window.setInterval(() => setPosts((current) => recentSocialPosts(current)), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const companiesList = useMemo(() => {
    const fromPosts = posts.map((p) => p.company);
    const fromChannels = majorChannels.map((c) => c.company);
    return [...new Set([...fromChannels, ...fromPosts])].filter(Boolean);
  }, [posts]);

  const shown = useMemo(() => {
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const cutoff = Date.now() - Number(days) * 86400000;
    return posts.filter(
      (post) =>
        (!company || post.company === company) &&
        (!platform || post.platform === platform) &&
        Date.parse(post.date) >= cutoff &&
        words.every((word) =>
          `${post.text} ${post.author} ${post.handle} ${post.company} ${(post.products || []).join(' ')}`
            .toLocaleLowerCase()
            .includes(word)
        )
    );
  }, [posts, company, platform, query, days]);

  useEffect(() => {
    setVisibleCount(24);
  }, [company, platform, query, days, refresh]);

  useEffect(() => {
    const target = sentinel.current;
    if (!target || visibleCount >= shown.length) return;
    if (!('IntersectionObserver' in window)) {
      setVisibleCount(shown.length);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((count) => Math.min(count + 24, shown.length));
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [visibleCount, shown.length]);

  return (
    <div className="space-page space-plaza mx-auto max-w-6xl px-4 py-6">
      <header className="space-header mb-6">
        <div>
          <p className="space-label">정보관</p>
          <h1>기업 SNS & 공식 미디어</h1>
          <p className="space-caption">AI 선도 대기업의 실제 메인 소통 채널과 최신 공식 발표를 한곳에서 확인하세요.</p>
        </div>
      </header>

      {/* AI 선도 대기업 실시간 메인 소통구 (X/Twitter) */}
      <section className="mb-8" aria-label="선도 대기업 메인 소통 채널">
        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">AI 선도 대기업 메인 소통구 (X · Twitter)</h2>
            <p className="text-xs text-gray-500 mt-0.5">각 기업 창립자 및 공식 계정의 실시간 발표·소통 창구</p>
          </div>
          <span className="text-xs text-gray-400">실시간 다이렉트 연결</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {majorChannels.map((ch) => (
            <a
              key={ch.id}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-3.5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {ch.name}
                    </span>
                    <span className="text-xs text-gray-400">@{ch.handle}</span>
                  </div>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{ch.company} · {ch.role}</p>
                </div>
                <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                  <WayfindingIcon direction="external" />
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2 line-clamp-1">{ch.note}</p>
            </a>
          ))}
        </div>
      </section>

      {/* 필터 및 검색 */}
      <section className="qualification-filters" aria-label="소셜 미디어 게시물 검색">
        <div className="qualification-filter-heading">
          <div>
            <span>공식 발표 살펴보기</span>
            <h2>최신 7일 공식 발표 & 소셜 피드</h2>
          </div>
          <p>YouTube 공식 발표 영상 · Bluesky · 최근 7일</p>
        </div>

        <div className="social-filter-grid">
          <label>
            기업
            <select value={company} onChange={(e) => setCompany(e.target.value)}>
              <option value="">전체 기업</option>
              {companiesList.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            플랫폼 / 형태
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="">전체 플랫폼</option>
              <option value="YouTube">공식 발표 영상 (YouTube)</option>
              <option value="Bluesky">소셜 텍스트 (Bluesky)</option>
              <option value="Mastodon">마스토돈 (Mastodon)</option>
            </select>
          </label>
          <label>
            게시 기간
            <select value={days} onChange={(e) => setDays(e.target.value)}>
              <option value="1">최근 24시간</option>
              <option value="3">최근 3일</option>
              <option value="7">최근 7일</option>
            </select>
          </label>
          <label>
            키워드·내용 검색
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="모델명·제품·주제 검색"
            />
          </label>
        </div>

        <p className="social-note">
          AI 정보의 높은 신선도를 위해 최근 7일 이내의 공식 영상 및 발표 자료만 선별하여 노출합니다. 오래된 과거 자료는 자동으로 제외됩니다.
        </p>

        {!loading && checkedAt !== null && (
          <details className="social-note">
            <summary className="cursor-pointer font-semibold">
              채널별 연동 상태 ·{' '}
              {new Date(checkedAt).toLocaleString('ko-KR', {
                timeZone: 'Asia/Seoul',
                dateStyle: 'short',
                timeStyle: 'short',
              })}{' '}
              확인
            </summary>
            <ul className="mt-2 space-y-1">
              {checks.map((check) => (
                <li key={check.label}>
                  {check.label} · {check.failed ? '조회 실패' : `최근 7일 표시 가능 ${check.count}건`}
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="qualification-filter-footer">
          <p role="status">{loading ? '게시물을 불러오는 중…' : `${shown.length}개 표시`}</p>
          <button type="button" onClick={() => setRefresh((n) => n + 1)}>
            새로고침
          </button>
        </div>
      </section>

      {/* 결과 목록 */}
      <section className="qualification-results" aria-label="SNS 및 영상 목록">
        {failures.length > 0 && failures.length === checks.length && (
          <p className="social-error" role="alert">
            소셜 채널을 불러오지 못했습니다. 잠시 후 다시 시도하거나 상단의 공식 채널을 방문해 주세요.
          </p>
        )}

        {!loading && shown.length === 0 && (
          <p className="qualification-empty">
            선택한 조건(최근 {days}일)에 해당하는 공식 발표가 없습니다. 다른 기업을 선택하거나 상단의 공식 소통 채널(X)을 직접 확인해 보세요.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.slice(0, visibleCount).map((post, index) => (
            <article
              key={`${post.id}-${post.company}-${index}`}
              className="space-card rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {/* 유튜브 썸네일 미리보기 */}
              {post.thumbnail && (
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.text}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                    공식 영상
                  </span>
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span className="font-semibold text-blue-600">
                      {post.company} · {post.platform}
                    </span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleString('ko-KR', {
                        timeZone: 'Asia/Seoul',
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </time>
                  </div>

                  <p className="text-xs text-gray-400 mb-2">{post.author}</p>

                  <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">
                    {post.text.split(' — ')[0]}
                  </h3>

                  {post.text.includes(' — ') && (
                    <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                      {post.text.split(' — ')[1]}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-[11px] text-gray-400">
                    {(post.products || []).slice(0, 2).join(', ')}
                  </span>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    원문 보기 <WayfindingIcon direction="external" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visibleCount < shown.length && (
          <div ref={sentinel} className="social-note mt-6 text-center" role="status">
            스크롤하면 더 많은 게시물을 보여드립니다.
          </div>
        )}

        <p className="social-note mt-8">
          게시물 신고·삭제·정정 요청은{' '}
          <a href="mailto:eunmastudio@gmail.com" className="underline">
            eunmastudio@gmail.com
          </a>
          으로 보내주세요.
        </p>
      </section>
    </div>
  );
}
