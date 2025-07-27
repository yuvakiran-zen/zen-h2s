// Data structure interfaces for dynamic content

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
  personality: 'conservative' | 'balanced' | 'aggressive';
  goals: string[];
  avatar?: string;
  monthlyIncome?: string;
  monthlyExpenses?: string;
  currentSavings?: string;
  riskTolerance?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'future_self' | 'ai_assistant';
  timestamp: Date;
  futureAge?: number;
}

export interface FinancialData {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  investmentValue?: number;
  investmentReturns?: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'investment' | 'spending' | 'savings' | 'debt';
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  potentialSavings: number;
  steps: string[];
  isCompleted?: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  type: 'conservative' | 'balanced' | 'aggressive';
  finalNetWorth: number;
  confidenceScore: number;
  timeline: TimelinePoint[];
  isSelected?: boolean;
}

export interface TimelinePoint {
  year: number;
  netWorth: number;
  debt: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  milestones: Milestone[];
}

export interface Milestone {
  type: string;
  title: string;
  description: string;
  value: number;
}

export interface ProgressMetrics {
  healthScore: number;
  period: {
    netWorthGrowth: number;
    netWorthGrowthPercent: number;
    totalSaved: number;
    savingsRate: number;
    investmentReturns: number;
    investmentReturnsPercent: number;
    debtReduction: number;
    debtReductionPercent: number;
  };
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
  emoji: string;
}

export interface Goal {
  title: string;
  progress: number;
  currentAmount: number;
  targetAmount: number;
  targetDate: string;
  onTrack: boolean;
}

export interface ProgressData {
  healthScore: number;
  monthly: ProgressMetrics['period'];
  quarterly: ProgressMetrics['period'];
  yearly: ProgressMetrics['period'];
  recentAchievements: Achievement[];
  goalsProgress: Goal[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ChatResponse {
  message: string;
  sender: 'future_self' | 'ai_assistant';
  futureAge?: number;
} 