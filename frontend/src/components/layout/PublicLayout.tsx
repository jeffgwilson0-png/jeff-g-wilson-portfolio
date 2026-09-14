import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BackgroundGlows } from './BackgroundGlows';
import { Profile } from '../../types';
import { api } from '../../api/client';

export const PublicLayout: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface relative transition-colors duration-200">
      <BackgroundGlows />
      <Navbar profile={profile} />
      <main className="flex-1 z-10 w-full pt-[76px] sm:pt-[88px] lg:pt-[100px]">
        <Outlet context={{ profile }} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};
