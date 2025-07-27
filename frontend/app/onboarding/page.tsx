"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingPage from '@/components/OnboardingPage';
import { useAuthGuard } from '@/lib/auth';
import { generateRandomAmount } from '@/lib/utils';

export default function OnboardingPageRoute() {
  const router = useRouter();
  const auth = useAuthGuard({ 
    requireAuth: true, 
    requireAccounts: true 
  });
  
  // Generate dynamic defaults instead of hardcoded values
  const generateProfileDefaults = () => {
    const currentAge = generateRandomAmount(25, 40);
    const futureAge = Math.min(currentAge + generateRandomAmount(15, 25), 70);
    const personalities = ['conservative', 'balanced', 'aggressive'];
    const goalOptions = ['retirement', 'house', 'education', 'travel', 'business'];
    
    return {
      age: currentAge,
      futureAge,
      personality: personalities[Math.floor(Math.random() * personalities.length)],
      goals: goalOptions.slice(0, 2 + Math.floor(Math.random() * 2)), // 2-3 random goals
      avatar: 'default'
    };
  };
  
  const [userProfile, setUserProfile] = useState(auth.userProfile || generateProfileDefaults());

  const handleProfileUpdate = (updates: any) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const handleComplete = (profile: any) => {
    auth.updateProfile(profile);
    router.push('/chat');
  };

  const handleBack = () => {
    router.push('/connect');
  };

  if (auth.isLoading || !auth.user) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  return (
    <OnboardingPage
      userProfile={userProfile}
      onProfileUpdate={handleProfileUpdate}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}