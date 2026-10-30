import { useEffect, useMemo, useRef, useState } from 'react';
import { WayfindingIcon } from '../components/WayfindingIcon';
import { parseSocialFeed, socialSources } from '../lib/social-feed.mjs';
import type { SocialPost } from '../lib/social-feed.mjs';

export default function Social() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [failures, setFailures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [company, setCompany] = useState('');
  const [channel, setChannel] = useState('');
  const [query, setQuery] = useState('');
  const [days, setDays] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setPosts([]); setFailures([]);
    Promise.allSettled(socialSources.map(async (source) => {
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
    })).then((results) => {
      if (abort.signal.aborted) return;
      setPosts(results.flatMap((result) => result.status === 'fulfilled' ? result.value : []).sort((a, b) => b.date.localeCompare(a.date)));
      setFailures(results.flatMap((result, i) => result.status === 'rejected' ? [`@${socialSources[i].handle}`] : []));
      setLoading(false);
    });
    return () => abort.abort();
  }, [refresh]);
  const shown = useMemo(() => {
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const cutoff = days ? Date.now() - Number(days) * 86400000 : 0;
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
    <section className="qualification-filters" aria-label="SNS 게시물 검색"><div className="qualification-filter-heading"><div><span>공식 채널 살펴보기</span><h2>기업의 목소리를 가까이</h2></div><p>Bluesky 공개 게시물 · 계정별 최신 100건</p></div>
      <div className="social-filter-grid"><label>기업<select value={company} onChange={(e) => setCompany(e.target.value)}><option value="">전체 기업</option>{[...new Set(socialSources.map((item) => item.company))].map((name) => <option key={name}>{name}</option>)}</select></label><label>계정 유형<select value={channel} onChange={(e) => setChannel(e.target.value)}><option value="">전체 유형</option><option>기업 공식</option><option>관계자 개인</option></select></label><label>게시 기간<select value={days} onChange={(e) => setDays(e.target.value)}><option value="30">최근 30일</option><option value="7">최근 7일</option><option value="90">최근 90일</option><option value="">가져온 전체</option></select></label><label>키워드·작성자 검색<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="기업·제품·작성자·내용" /></label></div>
      <p className="social-note">페이지를 열면 브라우저가 Bluesky에 직접 요청합니다. 게시물은 저장하지 않으며 원문 삭제는 다음 조회에 반영됩니다. 이미지·첨부 자료는 원문에서 확인하세요.</p>
      <p className="social-note">대상 계정: {socialSources.map((source, index) => <span key={source.id}>{index > 0 && ' · '}<a className="underline" href={`https://bsky.app/profile/${encodeURIComponent(source.actor)}`} target="_blank" rel="noopener noreferrer">{source.company} @{source.handle} ({source.channel})</a></span>)}. 관계자 개인 의견은 회사의 공식 입장이 아닙니다.</p>
      <div className="qualification-filter-footer"><p role="status">{loading ? '게시물을 불러오는 중…' : `${shown.length}개 표시`}</p><button type="button" onClick={() => setRefresh((n) => n + 1)}>새로고침</button></div>
    </section>
    <section className="qualification-results" aria-label="SNS 게시물 목록">
      {failures.length > 0 && <p className="social-error" role="alert">{failures.join(', ')} 채널을 불러오지 못했습니다. 잠시 후 다시 시도하거나 공식 계정을 방문해 주세요.</p>}
      {!loading && failures.length < socialSources.length && shown.length === 0 && <p className="qualification-empty">표시할 게시물이 없습니다. 기간을 늘리거나 조건을 바꿔보세요.</p>}
      <div className="social-list">{shown.slice(0, visibleCount).map((post, index) => <article key={`${post.id}-${post.company}-${index}`} className="space-card social-card"><div className="social-card-meta"><span>{post.company} · {post.channel} · Bluesky</span><time dateTime={post.date}>{new Date(post.date).toLocaleString('ko-KR', { timeZone:'Asia/Seoul', dateStyle:'medium', timeStyle:'short' })}</time></div><p className="social-author">{post.author} {post.handle && `@${post.handle}`}{post.repost && ' · 재게시'}</p><p className="social-text">{post.text.slice(0, 220)}{post.text.length > 220 ? '…' : ''}</p><a href={post.url} target="_blank" rel="noopener noreferrer">원문 보기 <WayfindingIcon direction="external" /></a></article>)}</div>
      {visibleCount < shown.length && <div ref={sentinel} className="social-note" role="status">스크롤하면 더 많은 게시물을 보여드립니다.</div>}
      <p className="social-note">게시물 신고·삭제·정정 요청은 <a href="mailto:eunmastudio@gmail.com" className="underline">eunmastudio@gmail.com</a>으로 보내주세요. 각 게시물은 원문에서도 신고할 수 있습니다.</p>
    </section>
  </div>;
}
