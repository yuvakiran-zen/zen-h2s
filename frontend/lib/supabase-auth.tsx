"use client";

import React, { useEffect, useState, createContext, useContext } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, Tables } from './supabase';
import { useRouter } from 'next/navigation';

// Types
export interface UserProfile extends Tables<'profiles'> {}
export interface ConnectedAccount extends Tables<'connected_accounts'> {}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  connectedAccounts: ConnectedAccount[];
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  refreshConnectedAccounts: () => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Fetch connected accounts
  const fetchConnectedAccounts = async (userId: string): Promise<ConnectedAccount[]> => {
    try {
      const { data, error } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching connected accounts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      return [];
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Refresh connected accounts
  const refreshConnectedAccounts = async () => {
    if (user) {
      const accounts = await fetchConnectedAccounts(user.id);
      setConnectedAccounts(accounts);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        Promise.all([
          fetchProfile(session.user.id),
          fetchConnectedAccounts(session.user.id)
        ]).then(([profileData, accountsData]) => {
          setProfile(profileData);
          setConnectedAccounts(accountsData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const [profileData, accountsData] = await Promise.all([
            fetchProfile(session.user.id),
            fetchConnectedAccounts(session.user.id)
          ]);
          setProfile(profileData);
          setConnectedAccounts(accountsData);
        } else {
          setProfile(null);
          setConnectedAccounts([]);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Auth methods
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        return { error: new Error(error.message) };
      }

      // Refresh profile data
      await refreshProfile();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    connectedAccounts,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    signOut,
    updateProfile,
    refreshProfile,
    refreshConnectedAccounts,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Auth guard hook
export function useAuthGuard(options: {
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireAccounts?: boolean;
  redirectTo?: string;
} = {}) {
  const {
    requireAuth = false,
    requireProfile = false,
    requireAccounts = false,
    redirectTo = '/auth'
  } = options;

  const { user, profile, connectedAccounts, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (loading || isRedirecting) return;

    // Check authentication requirement
    if (requireAuth && !user) {
      setIsRedirecting(true);
      router.push(redirectTo);
      return;
    }

    // Check profile requirement
    if (requireProfile && user && !profile) {
      setIsRedirecting(true);
      router.push('/onboarding');
      return;
    }

    // Check connected accounts requirement
    if (requireAccounts && user && connectedAccounts.length === 0) {
      setIsRedirecting(true);
      router.push('/connect');
      return;
    }
  }, [user, profile, connectedAccounts, loading, requireAuth, requireProfile, requireAccounts, redirectTo, router, isRedirecting]);

  return {
    user,
    profile,
    connectedAccounts,
    loading: loading || isRedirecting,
    isAuthenticated: !!user,
    hasProfile: !!profile,
    hasAccounts: connectedAccounts.length > 0,
  };
}

// Utility functions for backward compatibility
export const isAuthenticated = (): boolean => {
  return !!supabase.auth.getUser();
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
}; 