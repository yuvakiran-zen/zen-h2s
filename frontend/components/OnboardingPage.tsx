"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Target, Users, Heart, Home, GraduationCap, Briefcase, Plane, Shield, Sparkles, CheckCircle, ArrowLeft, Zap } from 'lucide-react';
import Avatar from '@/components/Avatar';
import Navbar from '@/components/Navbar';

interface OnboardingPageProps {
  userProfile: any;
  onProfileUpdate: (updates: any) => void;
  onComplete: (profile: any) => void;
  onBack: () => void;
}

export default function OnboardingPage({ userProfile, onProfileUpdate, onComplete, onBack }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Choose Your Future Age",
      subtitle: "Select the age you'd like to have conversations with"
    },
    {
      title: "Define Your Risk Personality", 
      subtitle: "This helps us tailor advice to your comfort level"
    },
    {
      title: "Set Your Life Goals",
      subtitle: "Choose what matters most to you"
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#725BF4] to-[#5d47d9] bg-clip-text text-transparent mb-4">
                {userProfile.futureAge}
              </div>
              <p className="text-lg text-gray-600 font-medium">Your future self&apos;s age</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <Slider
                  value={[userProfile.futureAge]}
                  onValueChange={(value) => onProfileUpdate({ futureAge: value[0] })}
                  max={90}
                  min={userProfile.age + 5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm font-semibold text-gray-700 mt-4">
                  <span>{userProfile.age + 5}</span>
                  <span>90</span>
                </div>
              </div>
            </div>

            {/* <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Zap className="w-6 h-6 text-[#725BF4] mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Early Career</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Target className="w-6 h-6 text-[#00A175] mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Prime Years</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Heart className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Wisdom Years</p>
              </div>
            </div> */}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { 
                value: 'conservative', 
                label: 'Conservative', 
                desc: 'Safe, steady growth. Security first.',
                emoji: '🛡️',
                color: 'bg-[#00A175]'
              },
              { 
                value: 'balanced', 
                label: 'Balanced', 
                desc: 'Mix of safety and growth opportunities.',
                emoji: '⚖️',
                color: 'bg-[#725BF4]'
              },
              { 
                value: 'aggressive', 
                label: 'Aggressive', 
                desc: 'Higher risk for potentially better returns.',
                emoji: '🚀',
                color: 'bg-gray-700'
              }
            ].map((option) => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg hover:-translate-y-1 ${
                  userProfile.personality === option.value 
                    ? `border-transparent shadow-lg ${option.color} text-white` 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => onProfileUpdate({ personality: option.value })}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{option.label}</h3>
                      <p className={`text-sm leading-relaxed ${
                        userProfile.personality === option.value ? 'text-white/90' : 'text-gray-600'
                      }`}>
                        {option.desc}
                      </p>
                    </div>
                    {userProfile.personality === option.value && (
                      <CheckCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-gray-600">Select multiple goals that matter to you</p>
            </div>
            
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
              {[
                { id: 'retirement', label: 'Retirement', color: 'bg-[#725BF4]', emoji: '🏖️' },
                { id: 'house', label: 'Dream Home', color: 'bg-[#00A175]', emoji: '🏡' },
                { id: 'education', label: "Children&apos;s Education", color: 'bg-gray-700', emoji: '🎓' },
                { id: 'business', label: 'Business', color: 'bg-[#725BF4]', emoji: '💼' },
                { id: 'travel', label: 'Travel', color: 'bg-[#00A175]', emoji: '✈️' },
                { id: 'emergency', label: 'Emergency Fund', color: 'bg-gray-700', emoji: '🛡️' }
              ].map((goal) => {
                const isSelected = userProfile.goals.includes(goal.id);
                
                return (
                  <Card
                    key={goal.id}
                    className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg hover:-translate-y-1 ${
                      isSelected
                        ? `border-transparent shadow-lg ${goal.color} text-white` 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => {
                      const newGoals = isSelected 
                        ? userProfile.goals.filter((g: string) => g !== goal.id)
                        : [...userProfile.goals, goal.id];
                      onProfileUpdate({ goals: newGoals });
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{goal.emoji}</div>
                      <h3 className="text-sm font-bold">{goal.label}</h3>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 mx-auto mt-2 text-white" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {userProfile.goals.length > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center bg-green-50 rounded-full px-4 py-2 border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-green-700 font-medium text-sm">
                    {userProfile.goals.length} goal{userProfile.goals.length === 1 ? "" : "s"} selected
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userProfile);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return userProfile.futureAge > userProfile.age;
      case 1: return userProfile.personality !== '';
      case 2: return userProfile.goals.length > 0;
      default: return false;
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Single Hero Section - Full Viewport */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Step Content Card */}
              <Card className="card-modern border-0 shadow-lg">
                <CardContent className="p-8">
                  {/* Step Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
                    <p className="text-gray-600">{currentStepData.subtitle}</p>
                  </div>

                  {/* Step Content */}
                  <div className="mb-8">
                    {renderStepContent()}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      className="h-12 px-6 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {currentStep === 0 ? 'Back' : 'Previous'}
                    </Button>
                    
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="h-12 px-6 bg-[#725BF4] hover:bg-[#5d47d9] text-white border-0 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentStep === steps.length - 1 ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Start Journey!
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avatar Preview Sidebar */}
            <div className="lg:col-span-4">
              <Card className="card-modern bg-[#725BF4] text-white border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold mb-6 text-white">
                    Your Future Self Preview
                  </h3>
                  
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-xl animate-pulse" />
                    <Avatar
                      age={userProfile.futureAge}
                      income={800000}
                      riskTolerance={userProfile.personality === 'conservative' ? 'low' : userProfile.personality === 'balanced' ? 'medium' : 'high'}
                      size="large"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-white">
                      Age {userProfile.futureAge}
                    </div>
                    {userProfile.personality && (
                      <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2">
                        <span className="text-white font-medium capitalize text-sm">
                          {userProfile.personality} Investor
                        </span>
                      </div>
                    )}
                    {userProfile.goals.length > 0 && (
                      <div className="text-white/80 text-sm">
                        {userProfile.goals.length} life goal{userProfile.goals.length === 1 ? "" : "s"} selected
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}