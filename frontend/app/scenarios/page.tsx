"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScenarioDashboard from '@/components/ScenarioDashboard';
import { useAuthGuard } from '@/lib/auth';
import { Scenario } from '@/lib/types';
import { mockApi } from '@/lib/mockApi';

export default function ScenariosPage() {
  const router = useRouter();
  const auth = useAuthGuard({ 
    requireAuth: true, 
    requireProfile: true 
  });
  
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load scenarios when component mounts
  useEffect(() => {
    const loadScenarios = () => {
      try {
        // Use mockApi for now, replace with real API later
        const data = mockApi.getScenarios();
        setScenarios(data);
      } catch (error) {
        console.error('Error loading scenarios:', error);
        setScenarios([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.userProfile) {
      loadScenarios();
    }
  }, [auth.userProfile]);

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'chat':
        router.push('/chat');
        break;
      case 'actions':
        router.push('/actions');
        break;
      case 'progress':
        router.push('/progress');
        break;
      default:
        break;
    }
  };

  const handleGenerateNewScenarios = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      try {
        const newData = mockApi.generateNewScenarios();
        setScenarios(newData);
      } catch (error) {
        console.error('Error generating scenarios:', error);
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  const handleSelectScenario = (scenarioId: string) => {
    // Here you would normally sync with your backend API
    console.log(`Selected scenario: ${scenarioId}`);
    // Could show a success message or navigate to a different page
  };

  if (auth.isLoading || !auth.userProfile) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  return (
    <ScenarioDashboard
      userProfile={auth.userProfile}
      scenarios={scenarios}
      onNavigate={handleNavigate}
      onGenerateNewScenarios={handleGenerateNewScenarios}
      onSelectScenario={handleSelectScenario}
      isLoading={isLoading}
    />
  );
}