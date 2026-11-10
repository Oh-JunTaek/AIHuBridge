import { useEffect, useMemo, useRef, useState } from 'react';
import { WayfindingIcon } from '../components/WayfindingIcon';
import { mastodonSources, parseMastodonFeed, parseSocialFeed, recentSocialPosts, socialSources } from '../lib/social-feed.mjs';
import type { SocialPost } from '../lib/social-feed.mjs';

export default function Social() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [failures, setFailures] = useState<string[]>([]);
  const [checks, setChecks] = useState<{ label: string; failed: boolean; count: number }[]>([]);
  const [checkedAt, setCheckedAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [company, setCompany] = useState('');
  const [channel, setChannel] = useState('');
  const [query, setQuery] = useState('');
  const [days, setDays] = useState('7');
  const [visibleCount, setVisibleCount] = useState(24);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setPosts([]); setFailures([]); setChecks([]); setCheckedAt(null);
    const feeds = socialSources.map(async (source) => {
      const url = new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed');
      url.searchParams.set('actor', source.actor); url.searchParams.set('limit', '100');
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
    const mastodonFeeds = mastodonSources.map(async (source) => {
      const request = new AbortController();
      const cancel = () => request.abort();
      abort.signal.addEventListener('abort', cancel, { once:true });
      const timer = window.setTimeout(cancel, 15000);
      try {
        const url = new URL(`/api/v1/accounts/${source.accountId}/statuses`, source.origin);
        url.searchParams.set('limit', '40'); url.searchParams.set('exclude_reblogs', 'true'); url.searchParams.set('exclude_replies', 'true');
        const response = await fetch(url, { signal:request.signal, cache:'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return parseMastodonFeed(await response.json(), source, (html) => new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '');
      } finally { window.clearTimeout(timer); abort.signal.removeEventListener('abort', cancel); }
    });
    const labels = [...socialSources.map((source) => `@${source.handle}`), ...mastodonSources.map((source) => `@${source.handle}`)];
    Promise.allSettled([...feeds, ...mastodonFeeds]).then((results) => {
      if (abort.signal.aborted) return;
      setPosts(recentSocialPosts(results.flatMap((result) => result.status === 'fulfilled' ? result.value : [])).sort((a, b) => b.date.localeCompare(a.date)));
      setFailures(results.flatMap((result, i) => result.status === 'rejected' ? [labels[i]] : []));
      setChecks(results.map((result, i) => ({ label: labels[i], failed: result.status === 'rejected', count: result.status === 'fulfilled' ? recentSocialPosts(result.value).length : 0 })));
      setCheckedAt(Date.now());
      setLoading(false);
    });
    return () => abort.abort();
  }, [refresh]);
  useEffect(() => { const timer = window.setInterval(() => setPosts((current) => recentSocialPosts(current)), 60000); return () => window.clearInterval(timer); }, []);
  const shown = useMemo(() => {
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const cutoff = Date.now() - Number(days) * 86400000;
    return posts.filter((post) => (!company || post.company === company) && (!channel || post.channel === channel) && Date.parse(post.date) >= cutoff && words.every((word) => `${post.text} ${post.author} ${post.handle} ${post.company} ${post.products.join(' ')}`.toLocaleLowerCase().includes(word)));
  }, [posts, company, channel, query, days]);
  useEffect(() => { setVisibleCount(24); }, [company, channel, query, days, refresh]);
  useEffect(() => {
    const target = sentinel.current;
    if (!target || visibleCount >= shown.length) return;
    if (!('IntersectionObserver' in window)) { setVisibleCount(shown.length); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setVisibleCount((count) => Math.min(count + 24, shown.length));
    }, { rootMargin: '200px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [visibleCount, shown.length]);
  return <div className="space-page space-plaza mx-auto max-w-6xl px-4 py-6">
    <header className="space-header mb-6"><div><p className="space-label">정보관</p><h1>기업 SNS</h1><p className="space-caption">기업과 관계자의 게시물을 원문과 함께 살펴보세요.</p></div></header>
    <section className="qualification-filters" aria-label="SNS 게시물 검색"><div className="qualification-filter-heading"><div><span>공식 채널 살펴보기</span><h2>기업의 목소리를 가까이</h2></div><p>Bluesky · Mastodon 공개 게시물 · 최근 7일</p></div>
      <div className="social-filter-grid"><label>기업<select value={company} onChange={(e) => setCompany(e.target.value)}><option value="">전체 기업</option>{[...new Set([...socialSources, ...mastodonSources].map((item) => item.company))].map((name) => <option key={name}>{name}</option>)}</select></label><label>계정 유형<select value={channel} onChange={(e) => setChannel(e.target.value)}><option value="">전체 유형</option><option>기업 공식</option><option>관계자 개인</option></select></label><label>게시 기간<select value={days} onChange={(e) => setDays(e.target.value)}><option value="1">최근 24시간</option><option value="3">최근 3일</option><option value="7">최근 7일</option></select></label><label>키워드·작성자 검색<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="기업·제품·작성자·내용" /></label></div>
      <p className="social-note">페이지를 열면 브라우저가 Bluesky와 Mastodon에 직접 요청합니다. 최근 7일 이내 게시물만 보여주며 저장하지 않습니다. 이미지·첨부 자료는 원문에서 확인하세요.</p>
      <p className="social-note">대상 계정: {socialSources.map((source, index) => <span key={source.id}>{index > 0 && ' · '}<a className="underline" href={`https://bsky.app/profile/${encodeURIComponent(source.actor)}`} target="_blank" rel="noopener noreferrer">{source.company} @{source.handle} ({source.channel})</a></span>)}{mastodonSources.map((source) => <span key={source.id}> · <a className="underline" href={source.profile} target="_blank" rel="noopener noreferrer">{source.company} @{source.handle} ({source.channel})</a></span>)}. 관계자 개인 의견은 회사의 공식 입장이 아닙니다.</p>
      <p className="social-note">외부 채널 바로가기 (게시물 자동 수집 없음): <a className="underline" href="https://www.youtube.com/@OpenAI" target="_blank" rel="noopener noreferrer">OpenAI YouTube</a> · <a className="underline" href="https://x.com/OpenAI" target="_blank" rel="noopener noreferrer">OpenAI X</a></p>
      {!loading && checkedAt !== null && <details className="social-note"><summary className="cursor-pointer font-semibold">계정별 조회 상태 · {new Date(checkedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', dateStyle: 'short', timeStyle: 'short' })} 확인</summary><ul className="mt-2 space-y-1">{checks.map((check) => <li key={check.label}>{check.label} · {check.failed ? '조회 실패' : `최근 7일 표시 가능 ${check.count}건`}</li>)}</ul><p className="mt-2">각 계정에서 가져온 최근 게시물 범위의 결과입니다. 표시 조건에 맞지 않는 게시물은 제외됩니다.</p></details>}
      <div className="qualification-filter-footer"><p role="status">{loading ? '게시물을 불러오는 중…' : `${shown.length}개 표시`}</p><button type="button" onClick={() => setRefresh((n) => n + 1)}>새로고침</button></div>
    </section>
    <section className="qualification-results" aria-label="SNS 게시물 목록">
      {failures.length > 0 && <p className="social-error" role="alert">{failures.join(', ')} 채널을 불러오지 못했습니다. 잠시 후 다시 시도하거나 공식 계정을 방문해 주세요.</p>}
      {!loading && failures.length < socialSources.length + mastodonSources.length && shown.length === 0 && <p className="qualification-empty">선택한 기간에 표시할 게시물이 없습니다. 검색 조건이나 공식 계정을 확인해 주세요.</p>}
      <div className="social-list">{shown.slice(0, visibleCount).map((post, index) => <article key={`${post.id}-${post.company}-${index}`} className="space-card social-card"><div className="social-card-meta"><span>{post.company} · {post.channel} · {post.platform}</span><time dateTime={post.date}>{new Date(post.date).toLocaleString('ko-KR', { timeZone:'Asia/Seoul', dateStyle:'medium', timeStyle:'short' })}</time></div><p className="social-author">{post.author} {post.handle && `@${post.handle}`}{post.repost && ' · 재게시'}</p><p className="social-text">{post.text.slice(0, 220)}{post.text.length > 220 ? '…' : ''}</p><a href={post.url} target="_blank" rel="noopener noreferrer">원문 보기 <WayfindingIcon direction="external" /></a></article>)}</div>
      {visibleCount < shown.length && <div ref={sentinel} className="social-note" role="status">스크롤하면 더 많은 게시물을 보여드립니다.</div>}
      <p className="social-note">게시물 신고·삭제·정정 요청은 <a href="mailto:eunmastudio@gmail.com" className="underline">eunmastudio@gmail.com</a>으로 보내주세요. 각 게시물은 원문에서도 신고할 수 있습니다.</p>
    </section>
  </div>;
}
