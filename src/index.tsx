import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import Home from './Pages/Home';
import Crypto from './Pages/Crypto';
import Trending from './Pages/Trending';
import Saved from './Pages/Saved';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '/',
        element: <Crypto />,
      },
      {
        path: '/trending',
        element: <Trending />,
      },
      {
        path: '/saved',
        element: <Saved />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<RouterProvider router={router} />);
