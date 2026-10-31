import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider, useLocation } from 'react-router-dom';
import './index.css';
import Root from './routes/Root';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Updates from './pages/Updates';
import Path from './pages/Path';
import Certs from './pages/Certs';
import Qualifications from './pages/Qualifications';
import Resources from './pages/Resources';
import Social from './pages/Social';
import Calendar from './pages/Calendar';
import Dev from './pages/Dev';
import NotFound from './pages/NotFound';
import SpaceOverview from './pages/SpaceOverview';
import Careers from './pages/Careers';

import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

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
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'learning', element: <SpaceOverview kind="learning" /> },
        { path: 'careers', element: <Careers /> },
        { path: 'careers/:careerId', element: <Careers /> },
        { path: 'information', element: <SpaceOverview kind="information" /> },
        { path: 'updates', element: <Updates /> },
        { path: 'research', element: <LegacyUpdatesRedirect /> },
        { path: 'path', element: <Path /> },
        { path: 'path/:journeyId', element: <Path /> },
        { path: 'certs', element: <Certs /> },
        { path: 'qualifications', element: <Qualifications /> },
        { path: 'resources', element: <Resources /> },
        { path: 'social', element: <Social /> },
        { path: 'calendar', element: <Calendar /> },
        { path: 'dev', element: <Dev /> },
        { path: 'settings', element: <Navigate to="/" replace /> },
        { path: 'terms', element: <Terms /> },
        { path: 'privacy', element: <Privacy /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

document.documentElement.classList.remove('dark');

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

