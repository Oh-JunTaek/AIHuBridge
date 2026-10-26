import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider, useLocation } from 'react-router-dom';
import './index.css';
import Root from './routes/Root';
import Home from './pages/Home';
import Updates from './pages/Updates';
import Path from './pages/Path';
import Certs from './pages/Certs';
import Calendar from './pages/Calendar';
import Dev from './pages/Dev';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { PreferencesProvider } from './lib/preferences';

import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import OpenRouterSkills from './pages/OpenRouterSkills';

// 이전 공유 주소는 검색 문자열·위치를 보존하고 새 주소로 대체한다.
function LegacyUpdatesRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: '/updates', search, hash }} replace />;
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        { path: 'updates', element: <Updates /> },
        { path: 'research', element: <LegacyUpdatesRedirect /> },
        { path: 'path', element: <Path /> },
        { path: 'certs', element: <Certs /> },
        { path: 'calendar', element: <Calendar /> },
        { path: 'openrouter-skills', element: <OpenRouterSkills /> },
        { path: 'dev', element: <Dev /> },
        { path: 'settings', element: <Settings /> },
        { path: 'terms', element: <Terms /> },
        { path: 'privacy', element: <Privacy /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <PreferencesProvider>
      <RouterProvider router={router} />
    </PreferencesProvider>
  </React.StrictMode>,
);

