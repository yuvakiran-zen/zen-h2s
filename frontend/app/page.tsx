"use client";

import { useRouter } from 'next/navigation';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth');
  };

  const handleLogin = () => {
    router.push('/auth');
  };

  return (
    <LandingPage 
      onGetStarted={handleGetStarted}
      onLogin={handleLogin}
    />
  );
}