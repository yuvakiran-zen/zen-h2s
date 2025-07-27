"use client";

import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import { useAuthGuard } from '@/lib/auth';
import { ChatMessage, ChatResponse } from '@/lib/types';
import { mockApi } from '@/lib/mockApi';

export default function ChatPage() {
  const router = useRouter();
  const auth = useAuthGuard({ 
    requireAuth: true, 
    requireAccounts: true, 
    requireProfile: true 
  });

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'scenarios':
        router.push('/scenarios');
        break;
      case 'actions':
        router.push('/actions');
        break;
      case 'progress':
        router.push('/progress');
        break;
      case 'landing':
        router.push('/');
        break;
      default:
        break;
    }
  };

  const handleSendMessage = async (message: string, userProfile: any): Promise<ChatResponse> => {
    // Use mockApi for now, replace with real API later
    // Pass connected accounts to the API
    return await mockApi.sendChatMessage(message, userProfile, auth.connectedAccounts);
  };

  // Create initial welcome message
  const getInitialMessages = (): ChatMessage[] => {
    if (!auth.userProfile) return [];
    
    return [
      {
        id: '1',
        content: `Hey there! I'm your ${auth.userProfile.futureAge}-year-old self. I've been looking at your financial data and I'm excited to help you make some great financial decisions! What's on your mind?`,
        sender: 'future_self',
        timestamp: new Date(),
        futureAge: auth.userProfile.futureAge
      }
    ];
  };

  if (auth.isLoading || !auth.user || !auth.userProfile) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  return (
    <ChatInterface
      user={auth.user}
      userProfile={auth.userProfile}
      connectedAccounts={auth.connectedAccounts}
      initialMessages={getInitialMessages()}
      onNavigate={handleNavigate}
      onSendMessage={handleSendMessage}
    />
  );
}