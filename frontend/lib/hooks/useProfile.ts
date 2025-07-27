"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../react-query';
import { UserProfile } from '../supabase-auth';

// Fetch profile
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profile(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const response = await fetch('/api/profile');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch profile');
      }
      
      const data = await response.json();
      return data.profile as UserProfile;
    },
    enabled: !!userId,
  });
}

// Update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }
      
      const data = await response.json();
      return data.profile as UserProfile;
    },
    onSuccess: (data, variables) => {
      // Update the profile cache
      queryClient.setQueryData(queryKeys.profile(data.user_id), data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
    },
  });
}

// Create profile
export function useCreateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create profile');
      }
      
      const data = await response.json();
      return data.profile as UserProfile;
    },
    onSuccess: (data) => {
      // Update the profile cache
      queryClient.setQueryData(queryKeys.profile(data.user_id), data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
    },
  });
} 