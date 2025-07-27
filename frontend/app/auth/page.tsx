"use client";

import { useRouter } from 'next/navigation';
import AuthPage from '@/components/AuthPage';

export default function AuthPageRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <AuthPage 
      onBack={handleBack}
    />
  );
}