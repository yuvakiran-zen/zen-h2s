"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressTracker from '@/components/ProgressTracker';
import { useAuthGuard } from '@/lib/auth';
import { ProgressData } from '@/lib/types';
import { mockApi } from '@/lib/mockApi';

export default function ProgressPage() {
  const router = useRouter();
  const auth = useAuthGuard({ 
    requireAuth: true, 
    requireProfile: true 
  });
  
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress data when component mounts
  useEffect(() => {
    const loadProgressData = () => {
      try {
        // Use mockApi for now, replace with real API later
        const data = mockApi.getProgressData();
        setProgressData(data);
      } catch (error) {
        console.error('Error loading progress data:', error);
        setProgressData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.userProfile) {
      loadProgressData();
    }
  }, [auth.userProfile]);

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'chat':
        router.push('/chat');
        break;
      case 'scenarios':
        router.push('/scenarios');
        break;
      case 'actions':
        router.push('/actions');
        break;
      default:
        break;
    }
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      try {
        const newData = mockApi.getProgressData();
        setProgressData(newData);
      } catch (error) {
        console.error('Error refreshing progress data:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  if (auth.isLoading || !auth.userProfile) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  return (
    <ProgressTracker
      userProfile={auth.userProfile}
      progressData={progressData}
      onNavigate={handleNavigate}
      onRefreshData={handleRefreshData}
      isLoading={isLoading}
    />
  );
}