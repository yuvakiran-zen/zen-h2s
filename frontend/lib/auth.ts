import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Auth state types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  dateJoined?: string;
  lastLogin?: string;
}

export interface UserProfile {
  age: number;
  futureAge: number;
  personality: string;
  goals: string[];
  avatar?: string;
  monthlyIncome?: string;
  monthlyExpenses?: string;
  currentSavings?: string;
  riskTolerance?: string;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('user');
};

// Get user data
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

// Get user profile
export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const profileData = localStorage.getItem('userProfile');
  return profileData ? JSON.parse(profileData) : null;
};

// Get connected accounts
export const getConnectedAccounts = (): string[] => {
  if (typeof window === 'undefined') return [];
  const accountsData = localStorage.getItem('connectedAccounts');
  return accountsData ? JSON.parse(accountsData) : [];
};

// Save user data
export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

// Save user profile
export const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

// Save connected accounts
export const saveConnectedAccounts = (accounts: string[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('connectedAccounts', JSON.stringify(accounts));
};

// Logout function
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('userProfile');
  localStorage.removeItem('connectedAccounts');
};

// Custom hook for auth state
export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = getUser();
    const profileData = getUserProfile();
    const accountsData = getConnectedAccounts();

    setUser(userData);
    setUserProfile(profileData);
    setConnectedAccounts(accountsData);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setUserProfile(null);
    setConnectedAccounts([]);
    router.push('/');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    saveUser(userData);
  };

  const updateProfile = (profileData: UserProfile) => {
    setUserProfile(profileData);
    saveUserProfile(profileData);
  };

  const updateConnectedAccounts = (accounts: string[]) => {
    setConnectedAccounts(accounts);
    saveConnectedAccounts(accounts);
  };

  return {
    user,
    userProfile,
    connectedAccounts,
    isLoading,
    isAuthenticated: !!user,
    hasProfile: !!userProfile,
    hasConnectedAccounts: connectedAccounts.length > 0,
    updateUser,
    updateProfile,
    updateConnectedAccounts,
    logout: handleLogout,
  };
};

// Auth guard hook for protected routes
export const useAuthGuard = (options: {
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireAccounts?: boolean;
  redirectTo?: string;
} = {}) => {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isLoading) return;

    const {
      requireAuth = true,
      requireProfile = false,
      requireAccounts = false,
      redirectTo = '/auth'
    } = options;

    if (requireAuth && !auth.isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (requireAccounts && !auth.hasConnectedAccounts) {
      router.push('/connect');
      return;
    }

    if (requireProfile && !auth.hasProfile) {
      router.push('/onboarding');
      return;
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.hasProfile, auth.hasConnectedAccounts, router, options]);

  return auth;
};