import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useT } from '../lib/i18n';

const groups = [
  { id: 'learning', key: 'nav.learning', items: [{ to: '/path', key: 'nav.path' }, { to: '/certs', key: 'nav.certs' }] },
  { id: 'information', key: 'nav.information', items: [{ to: '/updates', key: 'nav.updates' }, { to: '/calendar', key: 'nav.calendar' }] },
];
const activeStyle = 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100';
const idleStyle = 'text-stone-600 hover:bg-stone-200/60 dark:text-stone-300 dark:hover:bg-stone-800';
const focusStyle = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

export function SiteNavigation() {
  const t = useT();
  const location = useLocation();
  const [open, setOpen] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const pointerType = useRef<string | null>(null);

  useEffect(() => { setOpen(null); }, [location]);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !nav.current?.contains(event.target)) setOpen(null);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, []);

  return (
    <nav ref={nav} aria-label="주요 메뉴" className="relative flex w-full min-w-0 flex-wrap items-center gap-1 lg:w-auto"
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(null); }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          nav.current?.querySelector<HTMLButtonElement>(`#nav-${open}-trigger`)?.focus();
          setOpen(null);
        }
      }}>
      <NavLink to="/dashboard" className={({ isActive }) => `flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-semibold ${focusStyle} ${isActive ? activeStyle : idleStyle}`}>대시보드</NavLink>
      {groups.map((group) => {
        const expanded = open === group.id;
        const active = group.items.some((item) => location.pathname === item.to || location.pathname.startsWith(item.to + '/'));
        return (
          <div key={group.id} className="nav-group sm:relative"
            onPointerEnter={(event) => { if (event.pointerType === 'mouse') setOpen(group.id); }}
            onPointerLeave={(event) => { if (event.pointerType === 'mouse' && !(document.activeElement instanceof HTMLAnchorElement && event.currentTarget.contains(document.activeElement))) setOpen((current) => current === group.id ? null : current); }}>
            <button type="button" id={`nav-${group.id}-trigger`} aria-expanded={expanded} aria-controls={`nav-${group.id}-links`}
              onPointerDown={(event) => { pointerType.current = event.pointerType; }}
              onClick={(event) => { const fromMouse = event.detail > 0 && pointerType.current === 'mouse'; setOpen(fromMouse ? group.id : expanded ? null : group.id); pointerType.current = null; }}
              className={`flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${focusStyle} ${active || expanded ? activeStyle : idleStyle}`}>
              {t(group.key)}
            </button>
            <ul id={`nav-${group.id}-links`} hidden={!expanded}
              className="absolute left-0 right-0 top-full z-30 space-y-1 nav-popup rounded-xl border border-stone-200 bg-white p-2 shadow-lg dark:border-stone-700 dark:bg-stone-900 sm:right-auto sm:w-52 lg:left-auto lg:right-0">
              {group.items.map((item) => <li key={item.to}><NavLink to={item.to} onClick={() => setOpen(null)}
                className={({ isActive }) => `block rounded-lg px-3 py-3 text-sm font-medium ${focusStyle} ${isActive ? activeStyle : idleStyle}`}>
                {t(item.key)}
              </NavLink></li>)}
            </ul>
          </div>
        );
      })}
      <NavLink to="/settings" className={({ isActive }) => `flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium ${focusStyle} ${isActive ? activeStyle : idleStyle}`}>{t('nav.settings')}</NavLink>
    </nav>
  );
}
