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

export default function Root() {

export default function Root() {
