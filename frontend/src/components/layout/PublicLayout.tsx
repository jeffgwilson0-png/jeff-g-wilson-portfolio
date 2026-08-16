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
    <div className="flex flex-col min-h-screen relative selection:bg-primary/30 selection:text-primary">
      <BackgroundGlows />
      <Navbar profile={profile} />
      <main className="flex-1 z-10 pt-[100px] lg:pt-[130px]">
        <Outlet context={{ profile }} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};
