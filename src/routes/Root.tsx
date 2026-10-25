import { Outlet, NavLink } from 'react-router-dom';
import { nav } from '../lib/config';
import { BadgeIcon, QuizIcon, SettingsIcon, DevIcon } from '../components/icons';
import { LogoIcon } from '../components/LogoIcon';
import { useT } from '../lib/i18n';
import { useState } from 'react';

// 라우팅 정의 (t 없이 가능한 한 분리)
const topMenu = [
  {
    id: 'info',
    labelKey: 'nav.info',
    icon: <LogoIcon />,
    children: [{ to: '/research', key: 'nav.research', icon: <LogoIcon /> }],
  },
  {
    id: 'learn',
    labelKey: 'nav.learn',
    icon: <LogoIcon />,
    children: [
      { to: '/path', key: 'nav.path', icon: <LogoIcon /> },
      { to: '/certs', key: 'nav.certs', icon: <BadgeIcon /> },
    ],
  },
];

const moreLinks = [
  { to: '/quiz', key: 'nav.quiz', icon: <QuizIcon /> },
  { to: '/dev', key: 'nav.dev', icon: <DevIcon /> },
  { to: '/settings', key: 'nav.settings', icon: <SettingsIcon /> },
];

export default function Root() {
  const t = useT();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700 dark:bg-stone-950 dark:text-stone-200 flex flex-col transition-colors">
      <header className="sticky top-0 z-20 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur border-b border-stone-200 dark:border-stone-700">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          {/* 로고: HuBridge.png 이미지만 표시 */}
          <div className="flex items-center">
            <img
              src={`${import.meta.env.BASE_URL}icon/HuBridge.png`}
              alt="AI 허브릿지 로고"
              className="h-8 w-auto"
            />
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto">
            {topMenu.map((group) => (
              <div key={group.id} className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 whitespace-nowrap"
                >
                  {group.icon}
                  <span>{t(group.labelKey)}</span>
                </button>

                {/* 2-Level 드롭다운 */}
                <div className="absolute left-0 top-full mt-1 hidden min-w-[140px] flex-col gap-1 rounded-lg bg-stone-100 dark:bg-stone-800 p-1 text-sm shadow-lg group-hover:flex">
                  {group.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-1.5 rounded-md px-2 py-1.5 whitespace-nowrap ${
                          isActive
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 font-medium'
                            : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
                        }`
                      }
                    >
                      {child.icon}
                      <span>{t(child.key)}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}

            {/* More: 퀴즈 / 개발자 / 설정 */}
            <MoreMenu links={moreLinks} t={t} />
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

// More 버튼 컴포넌트 (간결화)
function MoreMenu({ links, t }: { links: typeof moreLinks; t: ReturnType<typeof useT> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 whitespace-nowrap"
      >
        <SettingsIcon />
        <span>More</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 flex min-w-[140px] flex-col gap-1 rounded-lg bg-stone-100 dark:bg-stone-800 p-1 text-sm shadow-lg">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-md px-2 py-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 font-medium'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
                }`
              }
            >
              {l.icon}
              <span>{t(l.key)}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}


