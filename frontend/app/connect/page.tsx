"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AccountConnection from '@/components/AccountConnection';
import { useAuthGuard } from '@/lib/auth';

export default function ConnectPage() {
  const router = useRouter();
  const auth = useAuthGuard({ requireAuth: true });
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>(auth.connectedAccounts || []);

  const handleAccountConnect = (account: string) => {
    const newAccounts = [...connectedAccounts, account];
    setConnectedAccounts(newAccounts);
    auth.updateConnectedAccounts(newAccounts);
  };

  const handleAccountDisconnect = (account: string) => {
    const newAccounts = connectedAccounts.filter(acc => acc !== account);
    setConnectedAccounts(newAccounts);
    auth.updateConnectedAccounts(newAccounts);
  };

  const handleContinue = () => {
    router.push('/onboarding');
  };

  const handleBack = () => {
    router.push('/auth');
  };

  if (auth.isLoading || !auth.user) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  return (
    <AccountConnection
      connectedAccounts={connectedAccounts}
      onAccountConnect={handleAccountConnect}
      onAccountDisconnect={handleAccountDisconnect}
      onContinue={handleContinue}
      onBack={handleBack}
    />
  );
}