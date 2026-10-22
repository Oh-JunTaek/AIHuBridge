import { Outlet, NavLink } from 'react-router-dom';
import { nav } from '../lib/config';
import {
  CompassIcon,
  HomeIcon,
  BookIcon,
  PathIcon,
  BadgeIcon,
  QuizIcon,
} from '../components/icons';
import { UserProvider } from '../lib/user';

const links: { to: string; label: string; icon: React.ReactNode }[] = [
  { to: '/', label: '브리핑', icon: <HomeIcon /> },
  { to: '/research', label: '리서치', icon: <BookIcon /> },
  { to: '/path', label: '학습 경로', icon: <PathIcon /> },
  { to: '/certs', label: '인증 뱃지', icon: <BadgeIcon /> },
  { to: '/quiz', label: '퀴즈', icon: <QuizIcon /> },
];

export default function Root() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col">
        <header className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur border-b border-slate-200">
          <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <CompassIcon />
              <span>{nav.siteName}</span>
            </div>
            <nav className="flex items-center gap-1 overflow-x-auto">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-200/60'
                    }`
                  }
                >
                  {l.icon}
                  <span>{l.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full">
          <Outlet />
        </main>

        <footer className="mt-16 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
          <span>© {nav.siteName} — 개인용 학습 보드 · 로컬 저장만 사용 · 언제든 초기화 가능</span>
        </footer>
      </div>
    </UserProvider>
  );
}

