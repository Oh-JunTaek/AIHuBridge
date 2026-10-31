import { WayfindingIcon } from '../components/WayfindingIcon';
import { PassageMark } from '../components/PassageMark';
import { Link } from 'react-router-dom';
import { useNews } from '../lib/use-news';
import { NewsStatus } from '../components/NewsStatus';
import { filterNews } from '../lib/news';
import { ClockIcon } from '../components/icons';
import { useT } from '../lib/i18n';
import { TodayBrief } from '../components/TodayBrief';
import { NewsCard } from '../components/NewsCard';

export default function Dashboard() {
  const { result, loading, reload, now } = useNews();
  const items = filterNews(result?.items ?? [], { limit: 6, days: 7, now });
  const t = useT();
  const date = new Date(now).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
  return (
    <div className="space-page space-plaza dashboard-page mx-auto max-w-6xl px-4 py-6">
      <header className="space-header dashboard-header mb-6">
        <div><p className="space-label">AI 허브릿지 대시보드</p><h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">AI 소식 한눈에</h1><p className="mt-2 text-sm text-stone-600 dark:text-stone-300">소식부터 배움까지, 필요한 정보를 한곳에서 만나보세요.</p><p className="dashboard-date">{date}</p></div>
        <Link to="/updates" className="dashboard-hero-link">AI 소식 모두 보기 <WayfindingIcon /></Link>
      </header>
      <div className="dashboard-layout">
        <aside className="dashboard-guide" aria-label="대시보드 빠른 이동">
          <span className="dashboard-kicker">AI 허브릿지 둘러보기</span><h2>관심 있는 공간으로</h2>
          <Link to="/updates"><span>AI 소식</span><PassageMark /></Link>
          <Link to="/calendar"><span>AI 캘린더</span><PassageMark /></Link>
          <Link to="/social"><span>기업 SNS</span><PassageMark /></Link>
          <Link to="/path"><span>추천 커리큘럼</span><PassageMark /></Link>
          <Link to="/resources"><span>학습 자료실</span><PassageMark /></Link>
          <Link to="/certs"><span>수료증 취득 강의</span><PassageMark /></Link>
          <Link to="/qualifications"><span>자격증 도전</span><PassageMark /></Link>
        </aside>
        <div className="dashboard-content">
          <div className="results-heading"><div><span>정보관의 소식</span><h2>최근 소식 살펴보기</h2></div><Link to="/updates">소식 모두 보기 <WayfindingIcon /></Link></div>
          <NewsStatus result={result} loading={loading} onRetry={reload} showWarning={false} />
          {!loading && <TodayBrief items={items} />}
          {!loading && result?.status === 'success' && items.length === 0 && <p className="text-sm text-stone-500">최근 7일 소식이 없습니다. AI 소식의 게시 기간을 넓혀 보관 자료를 찾아보세요.</p>}
          {!loading && items.length > 1 && <section className="mt-8"><h2 className="mb-3 text-sm font-semibold text-stone-600 dark:text-stone-300">{t('home.recent')}</h2><div className="grid gap-4 sm:grid-cols-2">{items.slice(1, 5).map((it) => <NewsCard key={it.id} item={it} />)}</div></section>}
          {!loading && items.length > 5 && <section className="mt-6"><div className="grid gap-3 sm:grid-cols-2">{items.slice(5, 6).map((it) => <div key={it.id} className="flex gap-2"><ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" /><a href={it.url} target="_blank" rel="noopener noreferrer" className="line-clamp-2 text-sm text-stone-700 hover:text-blue-700 hover:underline dark:text-stone-200">[{it.source}] {it.title}</a></div>)}</div></section>}
        </div>
      </div>
    </div>
  );
}
