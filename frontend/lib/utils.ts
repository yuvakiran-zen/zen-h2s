import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for generating dynamic data
export const generateUserId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const generateAvatarUrl = (name: string) => {
  // Use a deterministic avatar service instead of hardcoded Unsplash URLs
  const encodedName = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedName}&backgroundColor=725BF4`;
};

export const formatCurrency = (amount: number, currency: string = '₹') => {
  if (amount >= 10000000) {
    return `${currency}${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `${currency}${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `${currency}${(amount / 1000).toFixed(1)}K`;
  }
  return `${currency}${amount.toLocaleString('en-IN')}`;
};

export const generateRandomAmount = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateRandomDate = (daysAgo: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0];
};

export const getTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export const generateUserDefaults = (email: string) => {
  // Generate sensible defaults based on email or current date
  const currentYear = new Date().getFullYear();
  const currentAge = 25 + Math.floor(Math.random() * 15); // Age between 25-40
  
  return {
    id: generateUserId(),
    name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
    email,
    avatar: generateAvatarUrl(email),
    dateJoined: new Date(currentYear - 1, Math.floor(Math.random() * 12)).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }),
    lastLogin: getTimeAgo(new Date(Date.now() - Math.random() * 86400000 * 7)) // Within last week
  };
};
