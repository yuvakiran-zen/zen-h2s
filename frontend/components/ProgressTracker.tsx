"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, Target, Star, Calendar, DollarSign, PieChart, BarChart3, Zap, Trophy, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { ProgressData, UserProfile } from '@/lib/types';

interface ProgressTrackerProps {
  userProfile: UserProfile;
  progressData: ProgressData | null;
  onNavigate: (screen: string) => void;
  onRefreshData?: () => void;
  isLoading?: boolean;
}

export default function ProgressTracker({ 
  userProfile, 
  progressData, 
  onNavigate, 
  onRefreshData,
  isLoading = false 
}: ProgressTrackerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const getPeriodData = () => {
    if (!progressData) {
      // Return default empty data if progressData is null
      return {
        netWorthGrowth: 0,
        netWorthGrowthPercent: 0,
        totalSaved: 0,
        savingsRate: 0,
        investmentReturns: 0,
        investmentReturnsPercent: 0,
        debtReduction: 0,
        debtReductionPercent: 0
      };
    }

    switch (selectedPeriod) {
      case 'monthly': return progressData.monthly;
      case 'quarterly': return progressData.quarterly;
      case 'yearly': return progressData.yearly;
      default: return progressData.monthly;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getGradientStops = (score: number) => {
    const gradient = getHealthScoreGradient(score);
    const parts = gradient.split(' ');
    
    // Safely extract the gradient colors
    const fromColor = parts[0]?.replace('from-', '') || 'green-500';
    const toColor = parts[1]?.replace('to-', '') || 'emerald-600';
    
    return {
      start: `stop-${fromColor}`,
      end: `stop-${toColor}`
    };
  };

  const periodData = getPeriodData();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-slate-600">Loading progress data...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no progress data
  if (!progressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-slate-600 mb-4">No progress data available</div>
            {onRefreshData && (
              <button 
                onClick={onRefreshData}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Load Data
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Progress Tracker</h1>
            <p className="text-slate-600 text-lg">Monitor your financial journey and celebrate milestones</p>
          </div>
          
          {onRefreshData && (
            <Button
              onClick={onRefreshData}
              variant="outline"
              className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl px-6 py-3"
            >
              <Zap className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          )}
        </div>

        {/* Financial Health Score */}
        <Card className="card-modern mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Financial Health Score</h2>
                <p className="text-slate-600">Based on your savings rate, investment growth, and goal progress</p>
              </div>
              
              <div className="relative">
                <div className="w-32 h-32 rounded-full flex items-center justify-center relative">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="rgb(226, 232, 240)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="url(#healthGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${((progressData?.healthScore || 0) / 100) * 314.16} 314.16`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className={`${getGradientStops(progressData?.healthScore || 0).start}`} />
                        <stop offset="100%" className={`${getGradientStops(progressData?.healthScore || 0).end}`} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getHealthScoreColor(progressData?.healthScore || 0)}`}>
                        {progressData?.healthScore || 0}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">SCORE</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Period Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
            {(['monthly', 'quarterly', 'yearly'] as const).map((period) => (
              <Button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                className="rounded-xl text-sm px-6 py-2 capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Progress Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <span className={`text-2xl font-bold ${
                  periodData.netWorthGrowthPercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {periodData.netWorthGrowthPercent >= 0 ? '+' : ''}{periodData.netWorthGrowthPercent}%
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Net Worth Growth</h3>
              <p className="text-2xl font-bold text-slate-900 mb-2">
                {formatCurrency(periodData.netWorthGrowth)}
              </p>
              <p className="text-sm text-slate-500">This {selectedPeriod.replace('ly', '')}</p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {periodData.savingsRate}%
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Savings Rate</h3>
              <p className="text-2xl font-bold text-slate-900 mb-2">
                {formatCurrency(periodData.totalSaved)}
              </p>
              <p className="text-sm text-slate-500">Total saved</p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <span className={`text-2xl font-bold ${
                  periodData.investmentReturnsPercent >= 0 ? 'text-purple-600' : 'text-red-600'
                }`}>
                  {periodData.investmentReturnsPercent >= 0 ? '+' : ''}{periodData.investmentReturnsPercent}%
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Investment Returns</h3>
              <p className="text-2xl font-bold text-slate-900 mb-2">
                {formatCurrency(periodData.investmentReturns)}
              </p>
              <p className="text-sm text-slate-500">Portfolio growth</p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <PieChart className="w-8 h-8 text-orange-600" />
                <span className={`text-2xl font-bold ${
                  periodData.debtReduction >= 0 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {periodData.debtReduction >= 0 ? '-' : ''}{Math.abs(periodData.debtReductionPercent)}%
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Debt Status</h3>
              <p className="text-2xl font-bold text-slate-900 mb-2">
                {formatCurrency(Math.abs(periodData.debtReduction))}
              </p>
              <p className="text-sm text-slate-500">
                {periodData.debtReduction >= 0 ? 'Debt reduced' : 'Debt free'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-slate-800">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <span>Recent Achievements</span>
              </CardTitle>
              <CardDescription>Milestones you've reached recently</CardDescription>
            </CardHeader>
            <CardContent>
              {(progressData?.recentAchievements?.length || 0) === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-500">No recent achievements</p>
                  <p className="text-sm text-slate-400">Keep working towards your goals!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(progressData?.recentAchievements || []).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                      <div className="text-3xl">{achievement.emoji}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">{achievement.title}</h4>
                        <p className="text-slate-600 text-sm">{achievement.description}</p>
                        <p className="text-slate-500 text-xs mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-slate-800">
                <Target className="w-6 h-6 text-green-600" />
                <span>Goals Progress</span>
              </CardTitle>
              <CardDescription>Track your financial goals</CardDescription>
            </CardHeader>
            <CardContent>
              {(progressData?.goalsProgress?.length || 0) === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-500">No goals set</p>
                  <p className="text-sm text-slate-400">Set some financial goals to track progress!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {(progressData?.goalsProgress || []).map((goal, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-800">{goal.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-600">
                            {goal.progress}%
                          </span>
                          {goal.onTrack ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              On Track
                            </span>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              Behind
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Progress value={goal.progress} className="h-3" />
                      
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>{formatCurrency(goal.currentAmount)} saved</span>
                        <span>Target: {formatCurrency(goal.targetAmount)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>Target date: {goal.targetDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}