"use client";

import { useRouter } from 'next/navigation';
import ProfilePage from '@/components/ProfilePage';
import { useAuthGuard } from '@/lib/auth';

export default function ProfilePageRoute() {
  const router = useRouter();
  const auth = useAuthGuard({ 
    requireAuth: true 
  });

  const handleBack = () => {
    if (auth.hasProfile) {
      router.push('/chat');
    } else {
      router.push('/');
    }
  };

  const handleUpdateProfile = (updates: any) => {
    if (auth.user) {
      auth.updateUser({ ...auth.user, ...updates });
    }
  };

  const handleDisconnectAccount = (account: string) => {
    const newAccounts = auth.connectedAccounts.filter(acc => acc !== account);
    auth.updateConnectedAccounts(newAccounts);
  };

  if (auth.isLoading || !auth.user) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  return (
    <ProfilePage
      user={auth.user}
      userProfile={auth.userProfile}
      connectedAccounts={auth.connectedAccounts}
      onBack={handleBack}
      onUpdateProfile={handleUpdateProfile}
      onDisconnectAccount={handleDisconnectAccount}
      onLogout={auth.logout}
    />
  );
} 