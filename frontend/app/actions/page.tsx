"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ActionCenter from '@/components/ActionCenter';
import { useAuthGuard } from '@/lib/auth';
import { Recommendation } from '@/lib/types';
import { mockApi } from '@/lib/mockApi';

export default function ActionsPage() {
  const router = useRouter();
  const auth = useAuthGuard({ 
    requireAuth: true, 
    requireProfile: true 
  });
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recommendations when component mounts
  useEffect(() => {
    const loadRecommendations = () => {
      try {
        // Use mockApi for now, replace with real API later
        const data = mockApi.getRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.userProfile) {
      loadRecommendations();
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
      case 'progress':
        router.push('/progress');
        break;
      default:
        break;
    }
  };

  const handleMarkAsDone = (actionId: string) => {
    // Update the recommendation as completed
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === actionId 
          ? { ...rec, isCompleted: true }
          : rec
      )
    );
    // Here you would normally sync with your backend API
  };

  const handleRefreshRecommendations = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newData = mockApi.getRecommendations();
      setRecommendations(newData);
      setIsLoading(false);
    }, 1000);
  };

  if (auth.isLoading || !auth.userProfile) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-slate-600">Loading recommendations...</div>
      </div>
    );
  }

  return (
    <ActionCenter
      userProfile={auth.userProfile}
      recommendations={recommendations}
      onNavigate={handleNavigate}
      onMarkAsDone={handleMarkAsDone}
      onRefreshRecommendations={handleRefreshRecommendations}
    />
  );
}