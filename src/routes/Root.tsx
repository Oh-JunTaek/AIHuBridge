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
      className="min-h-screen bg-stone-50 text-stone-700 dark:bg-stone-950 dark:text-stone-200 flex flex-col transition-colors"
    >
      <header className="sticky top-0 z-20 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur border-b border-stone-200 dark:border-stone-700">
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

      <footer className="mt-16 border-t border-stone-200 dark:border-stone-700 py-6 text-center text-xs text-stone-400 dark:text-stone-500">
        <span>© {nav.siteName} — {t('footer.copy')}</span>
      </footer>
    </div>
  );
}


