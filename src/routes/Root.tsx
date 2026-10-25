import { Outlet, NavLink } from 'react-router-dom';
import { BadgeIcon, CalendarIcon, DevIcon, SettingsIcon } from '../components/icons';
import { LogoIcon } from '../components/LogoIcon';
import { useT } from '../lib/i18n';

// 공통 메뉴
const linkConfs = [
  { to: '/research', key: 'nav.research', icon: <LogoIcon /> },
  { to: '/path', key: 'nav.path', icon: <LogoIcon /> },
  { to: '/certs', key: 'nav.certs', icon: <BadgeIcon /> },
  { to: '/calendar', key: 'nav.calendar', icon: <CalendarIcon /> },
  { to: '/dev', key: 'nav.dev', icon: <DevIcon /> },
  { to: '/settings', key: 'nav.settings', icon: <SettingsIcon /> },
];

export default function Root() {
  const t = useT();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 dark:bg-stone-950 dark:text-stone-200 flex flex-col transition-colors">
      <header className="sticky top-0 z-20 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur border-b border-stone-200 dark:border-stone-700">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          {/* 투명 로고는 다크모드에서 단색으로 표시해 글자 대비를 확보한다. */}
          <NavLink to="/" className="shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}icon/hubridge-transparent.png`}
              alt="AI 허브릿지 로고"
              className="h-8 w-auto dark:brightness-0 dark:invert"
            />
          </NavLink>

          <nav className="flex items-center gap-1 overflow-x-auto">
            {linkConfs.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200'
                      : 'text-stone-500 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
                  }`
                }
              >
                {l.icon}
                <span>{t(l.key)}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-stone-200 dark:border-stone-700 py-4 text-center text-xs text-stone-400 dark:text-stone-500">
        <p className="mb-1">
          © {new Date().getFullYear()} AI 허브릿지. Developed by <strong className="text-amber-600">EunmaStudio</strong>.
        </p>
        <div className="flex justify-center gap-3 mt-1">
          <NavLink to="terms" className="hover:text-amber-600">이용약관</NavLink>
          <NavLink to="privacy" className="hover:text-amber-600">개인정보 처리방침</NavLink>
        </div>
      </footer>
    </div>
  );
}


