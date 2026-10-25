import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Root from './routes/Root';
import Home from './pages/Home';
import Research from './pages/Research';
import Path from './pages/Path';
import Certs from './pages/Certs';
import Calendar from './pages/Calendar';
import Dev from './pages/Dev';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { PreferencesProvider } from './lib/preferences';

import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        { path: 'research', element: <Research /> },
        { path: 'path', element: <Path /> },
        { path: 'certs', element: <Certs /> },
        { path: 'calendar', element: <Calendar /> },
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

