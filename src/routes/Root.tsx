import { Outlet, NavLink } from 'react-router-dom';
import { nav } from '../lib/config';
import {
  CompassIcon,
  HomeIcon,
  BookIcon,
  PathIcon,
  BadgeIcon,
  QuizIcon,
  SettingsIcon,
  DevIcon,
} from '../components/icons';
import { useT } from '../lib/i18n';

// 라우팅 + 번역 키 매핑 (label은 useT로 현지화)
const linkConfs = [
  { to: '/', key: 'nav.briefing', icon: <HomeIcon /> },
  { to: '/research', key: 'nav.research', icon: <BookIcon /> },
  { to: '/path', key: 'nav.path', icon: <PathIcon /> },
  { to: '/certs', key: 'nav.certs', icon: <BadgeIcon /> },
  { to: '/quiz', key: 'nav.quiz', icon: <QuizIcon /> },
  { to: '/dev', key: 'nav.dev', icon: <DevIcon /> },
  { to: '/settings', key: 'nav.settings', icon: <SettingsIcon /> },
];

export default function Root() {
  const t = useT();
  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 flex flex-col transition-colors"
    >
      <header className="sticky top-0 z-20 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <CompassIcon />
            <span>{nav.siteName}</span>
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {linkConfs.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
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

      <footer className="mt-16 border-t border-slate-200 dark:border-slate-700 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <span>© {nav.siteName} — {t('footer.copy')}</span>
      </footer>
    </div>
  );
}


