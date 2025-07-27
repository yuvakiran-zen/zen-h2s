"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Target, TrendingUp, Shield, Zap, BarChart3, PieChart, Clock, Sparkles, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Scenario, UserProfile } from '@/lib/types';

interface ScenarioDashboardProps {
  userProfile: UserProfile;
  scenarios: Scenario[];
  onNavigate: (screen: string) => void;
  onGenerateNewScenarios?: () => void;
  onSelectScenario?: (scenarioId: string) => void;
  isLoading?: boolean;
}

export default function ScenarioDashboard({ 
  userProfile, 
  scenarios, 
  onNavigate, 
  onGenerateNewScenarios,
  onSelectScenario,
  isLoading = false 
}: ScenarioDashboardProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const handleGenerateNewScenarios = async () => {
    if (onGenerateNewScenarios) {
      onGenerateNewScenarios();
    }
  };

  const handleLockPlan = () => {
    if (selectedScenario && onSelectScenario) {
      onSelectScenario(selectedScenario);
    }
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'conservative': return Shield;
      case 'balanced': return BarChart3;
      case 'aggressive': return TrendingUp;
      default: return Target;
    }
  };

  const getScenarioColor = (type: string) => {
    switch (type) {
      case 'conservative': return 'from-green-500 to-emerald-600';
      case 'balanced': return 'from-blue-500 to-indigo-600';
      case 'aggressive': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-slate-600">Generating scenarios...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Financial Scenarios</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Explore different paths to your financial future and see how various strategies could play out
          </p>
        </div>

        {/* Empty State */}
        {scenarios.length === 0 && (
          <div className="text-center py-16">
            <PieChart className="w-16 h-16 mx-auto mb-6 text-slate-400" />
            <h3 className="text-2xl font-bold text-slate-600 mb-4">No scenarios available</h3>
            <p className="text-slate-500 mb-6">
              {onGenerateNewScenarios 
                ? "Generate personalized financial scenarios based on your profile." 
                : "Connect to API to get personalized financial scenarios."
              }
            </p>
            {onGenerateNewScenarios && (
              <Button 
                onClick={handleGenerateNewScenarios}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl px-8 py-4"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Scenarios
              </Button>
            )}
          </div>
        )}

        {/* Scenarios Grid */}
        {scenarios.length > 0 && (
          <>
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {scenarios.map((scenario, index) => {
                const IconComponent = getScenarioIcon(scenario.type);
                const isSelected = selectedScenario === scenario.id;

                return (
                  <Card
                    key={scenario.id}
                    className={`cursor-pointer transition-all duration-300 rounded-3xl border-2 hover:shadow-xl hover:-translate-y-1 ${
                      isSelected 
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedScenario(scenario.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getScenarioColor(scenario.type)} flex items-center justify-center`}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            scenario.confidenceScore >= 80 ? 'bg-green-100 text-green-700' :
                            scenario.confidenceScore >= 65 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {scenario.confidenceScore}% Confidence
                          </span>
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl font-bold text-slate-800 mb-2">
                        {scenario.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        {scenario.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Final Net Worth */}
                      <div className="text-center p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl">
                        <div className="text-3xl font-bold text-indigo-600 mb-2">
                          ₹{(scenario.finalNetWorth / 10000000).toFixed(1)}Cr
                        </div>
                        <div className="text-slate-600 font-medium">Final Net Worth</div>
                      </div>

                      {/* Timeline Preview */}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3">Key Milestones:</h4>
                        <div className="space-y-2">
                          {scenario.timeline.slice(1).map((point, pointIndex) => (
                            <div key={pointIndex}>
                              {point.milestones.slice(0, 2).map((milestone, milestoneIndex) => {
                                const getIcon = (type: string) => {
                                  switch (type) {
                                    case 'house': return '🏠';
                                    case 'car': return '🚗';
                                    case 'education': return '🎓';
                                    case 'emergency': return '🛡️';
                                    case 'retirement': return '🏖️';
                                    default: return '🎯';
                                  }
                                };

                                return (
                                  <div key={milestoneIndex} className="flex items-center space-x-3 text-sm">
                                    <span className="text-lg">{getIcon(milestone.type)}</span>
                                    <span className="text-slate-700">{milestone.title}</span>
                                    <span className="text-slate-500">({point.year})</span>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="text-center">
                          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">
                            <Target className="w-4 h-4" />
                            <span className="font-semibold text-sm">Selected</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {onGenerateNewScenarios && (
                <Button
                  onClick={handleGenerateNewScenarios}
                  variant="outline"
                  className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl px-8 py-3"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Generate New Scenarios
                </Button>
              )}

              {selectedScenario && onSelectScenario && (
                <Button
                  onClick={handleLockPlan}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl px-8 py-3 font-semibold"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Lock This Plan
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}