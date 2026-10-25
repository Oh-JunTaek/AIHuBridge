import { Outlet, NavLink } from 'react-router-dom';
import { BadgeIcon, CalendarIcon, DevIcon, SettingsIcon } from '../components/icons';
import { LogoIcon } from '../components/LogoIcon';
import { useT } from '../lib/i18n';

// 1뎁스 메뉴 (Quiz 제거 + Calendar 추가)
const linkConfs = [
  { to: '/research', key: 'nav.research', icon: <LogoIcon /> },
  { to: '/path', key: 'nav.path', icon: <LogoIcon /> },
  { to: '/certs', key: 'nav.certs', icon: <BadgeIcon /> },
  { to: '/calendar', key: 'nav.calendar', icon: <CalendarIcon /> },
  { to: '/dev', key: 'nav.dev', icon: <DevIcon /> },
  { to: '/settings', key: 'nav.settings', icon: <SettingsIcon /> },
];
  const t = useT();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 dark:bg-stone-950 dark:text-stone-200 flex flex-col transition-colors">
      <header className="sticky top-0 z-20 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur border-b border-stone-200 dark:border-stone-700">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          {/* 濡쒓퀬: HuBridge.png ?대?吏 (?대┃ ?????쒕뵫) */}
          <NavLink to="/">
            <img
              src={`${import.meta.env.BASE_URL}icon/HuBridge.png`}
              alt="AI ?덈툕由우? 濡쒓퀬"
              className="h-8 w-auto"
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
          짤 {new Date().getFullYear()} AI ?덈툕由우?. Developed by <strong className="text-amber-600">EunmaStudio</strong>.
        </p>
        <div className="flex justify-center gap-3 mt-1">
          <NavLink to="terms" className="hover:text-amber-600">?댁슜?쎄?</NavLink>
          <NavLink to="privacy" className="hover:text-amber-600">媛쒖씤?뺣낫 泥섎━諛⑹묠</NavLink>
        </div>
      </footer>
    </div>
  );
}



