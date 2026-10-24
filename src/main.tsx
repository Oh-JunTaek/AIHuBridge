import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Root from './routes/Root';
import Home from './pages/Home';
import Research from './pages/Research';
import Path from './pages/Path';
import Certs from './pages/Certs';
import Quiz from './pages/Quiz';
import Dev from './pages/Dev';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { UserProvider } from './lib/user';

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
        { path: 'quiz', element: <Quiz /> },
        { path: 'dev', element: <Dev /> },
        { path: 'settings', element: <Settings /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>,
);

