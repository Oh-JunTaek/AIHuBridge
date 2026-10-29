import { Outlet, NavLink } from 'react-router-dom';
import { SiteNavigation } from '../components/SiteNavigation';

export default function Root() {

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 dark:bg-stone-950 dark:text-stone-200 flex flex-col transition-colors">
      <a href="#main-content" className="fixed left-4 top-2 z-50 -translate-y-24 rounded-lg bg-amber-600 px-4 py-3 text-white focus:translate-y-0">본문으로 건너뛰기</a>
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-stone-950/90 backdrop-blur border-b border-stone-200 dark:border-stone-700">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-4 py-2 lg:h-14 lg:flex-row lg:items-center lg:justify-between lg:py-0">
          <NavLink to="/" className="shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}icon/hubridge-transparent.png`}
              alt="AI 허브릿지 로고"
              className="h-8 w-auto dark:brightness-0 dark:invert"
            />
          </NavLink>

          <SiteNavigation />
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="w-full flex-1 scroll-mt-36">
        <Outlet />
      </main>

      <button type="button" className="back-to-top" aria-label="페이지 맨 위로 이동" onClick={() => { document.getElementById('main-content')?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }}>
        <span aria-hidden="true">TOP</span>
      </button>
      <footer className="mt-16 border-t border-stone-200 dark:border-stone-700 py-4 text-center text-xs text-stone-400 dark:text-stone-500">
        <p className="mb-1">
          © {new Date().getFullYear()} AI 허브릿지. 제작 <strong className="text-amber-600">EunmaStudio</strong>.
        </p>
        <div className="flex justify-center gap-3 mt-1">
          <NavLink to="terms" className="hover:text-amber-600">이용약관</NavLink>
          <NavLink to="privacy" className="hover:text-amber-600">개인정보 처리방침</NavLink>
        </div>
      </footer>
    </div>
  );
}
