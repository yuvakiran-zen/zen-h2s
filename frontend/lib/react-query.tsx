"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

// React Query configuration
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// Query Provider Component
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Common query keys
export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  profile: (userId: string) => ['profile', userId] as const,
  connectedAccounts: (userId: string) => ['connected-accounts', userId] as const,
  
  // Financial data
  financialData: (userId: string) => ['financial-data', userId] as const,
  
  // Recommendations
  recommendations: (userId: string) => ['recommendations', userId] as const,
  recommendation: (id: string) => ['recommendation', id] as const,
  
  // Scenarios
  scenarios: (userId: string) => ['scenarios', userId] as const,
  scenario: (id: string) => ['scenario', id] as const,
  
  // Chat
  chatMessages: (userId: string) => ['chat-messages', userId] as const,
  
  // Progress
  progressData: (userId: string) => ['progress-data', userId] as const,
} as const; 