"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Target, Zap, CheckCircle, TrendingUp, DollarSign, PiggyBank, CreditCard, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Recommendation, UserProfile } from '@/lib/types';

interface ActionCenterProps {
  userProfile: UserProfile;
  recommendations: Recommendation[];
  onNavigate: (screen: string) => void;
  onMarkAsDone?: (actionId: string) => void;
  onRefreshRecommendations?: () => void;
}

export default function ActionCenter({ 
  userProfile, 
  recommendations, 
  onNavigate, 
  onMarkAsDone,
  onRefreshRecommendations 
}: ActionCenterProps) {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'high_impact' | 'low_effort'>('all');

  const handleMarkAsDone = (actionId: string) => {
    setCompletedActions(prev => [...prev, actionId]);
    if (onMarkAsDone) {
      onMarkAsDone(actionId);
    }
    // Add confetti animation here
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filter === 'high_impact') return rec.impact === 'high';
    if (filter === 'low_effort') return rec.effort === 'low';
    return true;
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'from-red-500 to-pink-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'low': return 'from-green-500 to-emerald-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getActionIcon = (category: string) => {
    switch (category) {
      case 'investment': return TrendingUp;
      case 'spending': return DollarSign;
      case 'savings': return PiggyBank;
      case 'debt': return CreditCard;
      default: return Target;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        {/* Page Header and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Action Center</h1>
            <p className="text-slate-600">Turn insights into action with personalized recommendations</p>
          </div>
          
          <div className="flex items-center bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'ghost'}
              className="rounded-xl text-sm"
            >
              All
            </Button>
            <Button
              onClick={() => setFilter('high_impact')}
              variant={filter === 'high_impact' ? 'default' : 'ghost'}
              className="rounded-xl text-sm"
            >
              <Zap className="w-4 h-4 mr-1" />
              High Impact
            </Button>
            <Button
              onClick={() => setFilter('low_effort')}
              variant={filter === 'low_effort' ? 'default' : 'ghost'}
              className="rounded-xl text-sm"
            >
              <Filter className="w-4 h-4 mr-1" />
              Low Effort
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-effect border-0 rounded-3xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {recommendations.length}
              </div>
              <div className="text-slate-600 font-medium">Total Actions</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-0 rounded-3xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {completedActions.length}
              </div>
              <div className="text-slate-600 font-medium">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-0 rounded-3xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {recommendations.filter(r => r.impact === 'high').length}
              </div>
              <div className="text-slate-600 font-medium">High Impact</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-0 rounded-3xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                ₹{recommendations.reduce((sum, r) => sum + r.potentialSavings, 0).toLocaleString('en-IN')}
              </div>
              <div className="text-slate-600 font-medium">Potential Savings</div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {recommendations.length === 0 && (
          <div className="text-center py-16">
            <Target className="w-16 h-16 mx-auto mb-6 text-slate-400" />
            <h3 className="text-2xl font-bold text-slate-600 mb-4">No recommendations available</h3>
            <p className="text-slate-500 mb-6">
              {onRefreshRecommendations 
                ? "Try refreshing to get new personalized recommendations." 
                : "Connect to API to get personalized financial recommendations."
              }
            </p>
            {onRefreshRecommendations && (
              <Button 
                onClick={onRefreshRecommendations}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl"
              >
                Refresh Recommendations
              </Button>
            )}
          </div>
        )}

        {/* Recommendations Grid */}
        <div className="grid gap-6">
          {filteredRecommendations.map((recommendation) => {
            const IconComponent = getActionIcon(recommendation.category);
            const isCompleted = completedActions.includes(recommendation.id) || recommendation.isCompleted;
            
            return (
              <Card
                key={recommendation.id}
                className={`transition-all duration-300 border-2 rounded-3xl ${
                  isCompleted 
                    ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 opacity-75' 
                    : 'border-slate-200 bg-white hover:border-slate-300 card-hover'
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getImpactColor(recommendation.impact)} flex items-center justify-center`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className={`text-xl font-bold ${
                          isCompleted ? 'text-green-700 line-through' : 'text-slate-800'
                        }`}>
                          {recommendation.title}
                        </CardTitle>
                        <CardDescription className="text-slate-600 mt-1">
                          {recommendation.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEffortColor(recommendation.effort)}`}>
                          {recommendation.effort.toUpperCase()} EFFORT
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getImpactColor(recommendation.impact)} text-white`}>
                          {recommendation.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      
                      {recommendation.potentialSavings > 0 && (
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            +₹{recommendation.potentialSavings.toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-slate-500">potential savings</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Action Steps */}
                    <div className="bg-gradient-to-r from-slate-50 to-indigo-50 p-4 rounded-2xl">
                      <h4 className="font-semibold text-slate-800 mb-3">How to do this:</h4>
                      <ul className="space-y-2">
                        {recommendation.steps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-slate-700 leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Action Button */}
                    <div className="flex justify-end">
                      {isCompleted ? (
                        <div className="flex items-center space-x-2 text-green-600 bg-green-100 px-6 py-3 rounded-2xl">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Completed!</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleMarkAsDone(recommendation.id)}
                          className={`bg-gradient-to-r ${getImpactColor(recommendation.impact)} hover:shadow-lg text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105`}
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Mark as Done
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredRecommendations.length === 0 && recommendations.length > 0 && (
          <div className="text-center py-16">
            <Target className="w-16 h-16 mx-auto mb-6 text-slate-400" />
            <h3 className="text-2xl font-bold text-slate-600 mb-4">No actions match your filter</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filter or check back later for new recommendations.</p>
            <Button 
              onClick={() => setFilter('all')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl"
            >
              Show All Actions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}