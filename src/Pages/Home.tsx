import React from 'react';

import { Outlet } from 'react-router-dom';
import Logo from '../Components/Logo';
import Navigation from '../Components/Navigation';
import { CryptoProvider } from '../Context/CryptoContext';
import { StorageProvider } from '../Context/StorageContext';

const Home = () => {
  return (
    <CryptoProvider>
      <StorageProvider>
        <main className="relative flex h-full w-full flex-col items-center overflow-hidden font-nunito text-white first-letter:content-center">
          <div className="fixed -z-10 h-screen w-screen bg-gray-300" />
          <Logo />
          <Navigation />
          <Outlet />
        </main>
      </StorageProvider>
    </CryptoProvider>
  );
};

export default Home;
