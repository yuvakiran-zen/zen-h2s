"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, MessageCircle, TrendingUp, Shield, ArrowRight, Play, Star, Users, Zap, CheckCircle, Link, Settings, Rocket, Clock, CreditCard, UserCheck, Code, Database, Brain, Lightbulb, Target, Calendar, DollarSign, PieChart, BarChart3, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/supabase-auth';

interface LandingPageProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeDemo, setActiveDemo] = useState(0);
  const [activeTech, setActiveTech] = useState(0);

  const handleGetStarted = () => {
    // Check if user is authenticated
    if (user) {
      // User is authenticated, redirect to next step in flow
      router.push('/connect');
    } else {
      // User is not authenticated, go to auth page
      if (onGetStarted) {
        onGetStarted();
      } else {
        router.push('/auth');
      }
    }
  };

  const handleLogin = () => {
    // Check if user is authenticated
    if (user) {
      // User is already authenticated, redirect to chat
      router.push('/chat');
    } else {
      // User is not authenticated, go to auth page
      if (onLogin) {
        onLogin();
      } else {
        router.push('/auth');
      }
    }
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  // Static demo scenarios for marketing purposes
  const demoScenarios = [
    {
      question: "Should I buy a car worth ₹12L?",
      response: "That car will cost us ₹45L in opportunity cost over 20 years. Let's explore better alternatives!",
      impact: "₹45L saved",
      color: "text-red-500"
    },
    {
      question: "How much should I invest monthly?",
      response: "Based on your Fi Money data, you can comfortably invest ₹25K/month and still maintain your lifestyle.",
      impact: "₹1.2Cr by 45",
      color: "text-green-500"
    },
    {
      question: "When can I retire comfortably?",
      response: "With your current savings rate, you can retire at 52 with ₹3Cr corpus. Want to retire earlier?",
      impact: "Retire at 52",
      color: "text-blue-500"
    }
  ];

  const techFeatures = [
    {
      icon: Brain,
      title: "Advanced AI",
      description: "Gimini powered conversations that understand context and nuance",
      color: "text-[#725BF4]",
      bgColor: "bg-[#725BF4]"
    },
    {
      icon: Database,
      title: "Real-time Sync",
      description: "Live data integration with your financial accounts",
      color: "text-[#00A175]",
      bgColor: "bg-[#00A175]"
    },
    {
      icon: Shield,
      title: "Bank Security",
      description: "256-bit encryption with OAuth 2.0 authentication",
      color: "text-gray-700",
      bgColor: "bg-gray-700"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Predictive modeling for accurate financial projections",
      color: "text-[#725BF4]",
      bgColor: "bg-[#725BF4]"
    }
  ];

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#725BF4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="mx-auto px-6 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight text-gray-900">
              Talk to your{" "}
              <span className="text-[#725BF4] mt-2">
                Future{" "}
              </span>
              Self<br /> About
              <span className="text-6xl md:text-7xl font-bold mb-8 leading-tight text-[#00A175]"> Money</span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              An AI-powered mirror to your financial future. Get personalized advice from the person who knows you best - your future self.
            </p>

            <div className="flex justify-center items-center mb-16">
              <Button
                onClick={handleGetStarted}
                disabled={loading}
                className="bg-[#00A175] hover:bg-[#008a64] text-white font-semibold text-lg px-6 py-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                ) : (
                  <>
                    {user ? 'Continue Journey' : 'Get Started'}
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Refined Mock Chat Preview */}
      <div className="max-w-4xl mx-auto mb-20">
        <Card className="border border-gray-200 rounded-2xl shadow-lg">
          <CardContent className="p-8">
            <div className="space-y-6">

              {/* You */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#725BF4] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">You</span>
                </div>
                <div className="bg-gray-100 rounded-2xl px-6 py-4 max-w-md">
                  <p className="text-gray-800">
                    Should I buy that expensive car I've been wanting?
                  </p>
                </div>
              </div>

              {/* Future Self */}
              <div className="flex items-start space-x-4 justify-end">
                <div className="bg-[#00A175] bg-opacity-10 border border-[#00A175] border-opacity-20 rounded-2xl px-6 py-4 max-w-md text-right">
                  <p className="text-gray-800">
                    Hey, it's me at 45. That car will cost us ₹12L in opportunity cost.
                    <br />
                    Instead, if you invest that amount today based on your Fi Money pattern, we'll have an extra ₹45L for our dream home. 🏡
                    <br />
                    Think about the life we're building — not just the ride.
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#00A175] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">45</span>
                </div>
              </div>

              {/* You again */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#725BF4] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">You</span>
                </div>
                <div className="bg-gray-100 rounded-2xl px-6 py-4 max-w-md">
                  <p className="text-gray-800">
                    Hmm... what could I do with that ₹12L instead?
                  </p>
                </div>
              </div>

              {/* Future Self reply with options */}
              <div className="flex items-start space-x-4 justify-end">
                <div className="bg-[#00A175] bg-opacity-10 border border-[#00A175] border-opacity-20 rounded-2xl px-6 py-4 max-w-md text-right">
                  <p className="text-gray-800">
                    Great question! Based on your spending data, here are three smarter alternatives:
                    <ul className="list-disc list-inside text-left mt-2 text-sm text-gray-700">
                      <li>Start a ₹15K/month SIP — leads to ₹50L by age 45</li>
                      <li>Build a 6-month emergency fund</li>
                      <li>Put ₹2L into travel — reward, not regret 🌍</li>
                    </ul>
                    Let's make choices future us will high-five you for 🙌
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#00A175] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">45</span>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Features Section - Completely Redesigned */}
      <section id="features" className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        
        <div className="relative container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              The Science Behind<br/>
              <span className="text-[#725BF4] mt-2">Future{" "}</span>Self
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've reimagined financial advice by combining behavioral psychology, 
              real-time data analysis, and conversational AI to create your most trusted advisor.
            </p>
          </div>

          {/* Main Feature Grid */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Feature 1 - Data Integration */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00A175]/20 to-[#008a64]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                {/* Icon Container */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#00A175] to-[#008a64] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#725BF4] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#00A175] transition-colors duration-300">
                  Real Data Integration
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Connects to Fi Money & Zerodha for accurate, personalized financial projections based on your actual spending and investments.
                </p>
                
                {/* Interactive Data Flow */}
                <div className="bg-gradient-to-r from-[#00A175]/10 to-[#008a64]/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-[#00A175]" />
                      <span className="text-sm font-medium text-gray-700">Live Data Sync</span>
                    </div>
                    <div className="w-2 h-2 bg-[#00A175] rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Fi Money</span>
                      <span className="text-[#00A175] font-semibold">Connected</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Zerodha</span>
                      <span className="text-[#00A175] font-semibold">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - AI Conversations */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#725BF4]/20 to-[#5d47d9]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                {/* Icon Container */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#725BF4] to-[#5d47d9] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00A175] rounded-full flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#725BF4] transition-colors duration-300">
                  3-Way Conversations
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Chat with your future self at different ages (35, 45, 60) and get AI-powered insights that feel personal and motivating.
                </p>
                
                {/* Interactive Element */}
                <div className="bg-gradient-to-r from-[#725BF4]/10 to-[#5d47d9]/10 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#725BF4] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#725BF4] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-[#725BF4] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-[#725BF4] font-medium">Your future self is thinking...</span>
                  </div>
                </div>
                
                {/* Age Indicators */}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  {[35, 45, 60].map((age, index) => (
                    <div key={age} className="text-center group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${index * 100}ms`}}>
                      <div className="w-10 h-10 bg-gradient-to-br from-[#725BF4] to-[#5d47d9] rounded-full flex items-center justify-center mb-2 shadow-md">
                        <span className="text-white font-bold text-sm">{age}</span>
                      </div>
                      <div className="text-xs text-gray-500">Age {age}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 3 - Actionable Insights */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                {/* Icon Container */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00A175] rounded-full flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                  Actionable Scenarios
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Visualize different life paths, compare financial outcomes, and get specific recommendations you can act on immediately.
                </p>
                
                {/* Progress Visualization */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Scenario Confidence</span>
                    <span className="text-gray-700 font-semibold">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 h-2 rounded-full transition-all duration-1000 group-hover:w-[94%]" style={{width: '94%'}}></div>
                  </div>
                </div>
                
                {/* Action Items */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600 mb-2">Next Actions:</div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#00A175] rounded-full"></div>
                      <span className="text-xs text-gray-600">Increase SIP by ₹5K</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#725BF4] rounded-full"></div>
                      <span className="text-xs text-gray-600">Rebalance portfolio</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-[#725BF4] rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="w-8 h-8 bg-[#00A175] rounded-full border-2 border-white flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-white flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-gray-700 font-medium">Powered by cutting-edge financial AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Professional How It Works Section - Completely Redesigned */}
      <section id="how-it-works" className="relative py-32 overflow-hidden bg-white">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Your Journey to<br/>
              <span className="text-[#00A175] mt-2">Financial{" "}</span>Clarity
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From connection to conversation in minutes. Our streamlined onboarding gets you talking to your future self faster than ordering coffee.
            </p>
          </div>

          {/* Interactive Process Flow */}
          <div className="max-w-7xl mx-auto">
            {/* Connection Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-96 bg-gradient-to-b from-[#725BF4] via-[#00A175] to-gray-700 opacity-20 mt-20"></div>
            
            <div className="space-y-24">
              {/* Step 1 - Connect */}
              <div className="group relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1">
                    <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                      {/* Step Number */}
                      <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-[#725BF4] to-[#5d47d9] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                        <span className="text-white font-bold text-2xl">1</span>
                      </div>
                      
                      {/* Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-[#725BF4] to-[#5d47d9] rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <Link className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-3xl font-bold mb-6 text-gray-900 group-hover:text-[#725BF4] transition-colors duration-300">
                        Secure Account Connection
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                        Link your Fi Money and Zerodha accounts with bank-level encryption. Our OAuth integration means we never see your passwords - just the financial insights that matter.
                      </p>
                      
                      {/* Features List */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-[#725BF4] rounded-full"></div>
                          <span className="text-gray-700 font-medium">256-bit SSL encryption</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-[#725BF4] rounded-full"></div>
                          <span className="text-gray-700 font-medium">Read-only access</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-[#725BF4] rounded-full"></div>
                          <span className="text-gray-700 font-medium">Instant sync</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visual Element */}
                  <div className="order-1 lg:order-2">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-[#725BF4]/10 to-[#5d47d9]/10 rounded-3xl p-12 border border-[#725BF4]/20">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                            <div className="w-12 h-12 bg-[#00A175] rounded-xl flex items-center justify-center mb-4">
                              <span className="text-white font-bold text-sm">Fi</span>
                            </div>
                            <div className="text-sm text-gray-600">Banking Data</div>
                            <div className="text-xs text-gray-500 mt-1">Connected ✓</div>
                          </div>
                          <div className="bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1" style={{transitionDelay: '100ms'}}>
                            <div className="w-12 h-12 bg-[#725BF4] rounded-xl flex items-center justify-center mb-4">
                              <span className="text-white font-bold text-sm">Z</span>
                            </div>
                            <div className="text-sm text-gray-600">Investment Data</div>
                            <div className="text-xs text-gray-500 mt-1">Connected ✓</div>
                          </div>
                        </div>
                        <div className="mt-6 text-center">
                          <div className="inline-flex items-center space-x-2 bg-white/80 rounded-full px-4 py-2 shadow-sm">
                            <div className="w-2 h-2 bg-[#00A175] rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-700 font-medium">Syncing in real-time</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 - Configure */}
              <div className="group relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  {/* Visual Element */}
                  <div className="order-1">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-[#00A175]/10 to-[#008a64]/10 rounded-3xl p-12 border border-[#00A175]/20">
                        <div className="bg-white rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <div className="text-center mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#00A175] to-[#008a64] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                              <span className="text-white font-bold text-2xl">45</span>
                            </div>
                            <div className="text-lg font-semibold text-gray-900">Your Future Self</div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Risk Tolerance</span>
                              <span className="text-sm font-semibold text-[#00A175]">Balanced</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Primary Goal</span>
                              <span className="text-sm font-semibold text-[#00A175]">Dream Home</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Timeline</span>
                              <span className="text-sm font-semibold text-[#00A175]">20 years</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-2">
                    <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                      {/* Step Number */}
                      <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#00A175] to-[#008a64] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                        <span className="text-white font-bold text-2xl">2</span>
                      </div>
                      
                      {/* Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-[#00A175] to-[#008a64] rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <Settings className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-3xl font-bold mb-6 text-gray-900 group-hover:text-[#00A175] transition-colors duration-300">
                        Personalize Your Avatar
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                        Define your financial personality, goals, and risk tolerance. Our AI uses this to create a future self that thinks, talks, and advises just like you would - but with decades more wisdom.
                      </p>
                      
                      {/* Configuration Options */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-[#00A175]/10 to-[#008a64]/10 rounded-xl p-4 border border-[#00A175]/20">
                          <div className="text-sm font-semibold text-[#00A175] mb-1">Goals</div>
                          <div className="text-xs text-gray-600">Retirement, Home, Travel</div>
                        </div>
                        <div className="bg-gradient-to-r from-[#00A175]/10 to-[#008a64]/10 rounded-xl p-4 border border-[#00A175]/20">
                          <div className="text-sm font-semibold text-[#00A175] mb-1">Timeline</div>
                          <div className="text-xs text-gray-600">5, 15, 30 years</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 - Launch */}
              <div className="group relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1">
                    <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                      {/* Step Number */}
                      <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                        <span className="text-white font-bold text-2xl">3</span>
                      </div>
                      
                      {/* Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <Rocket className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-3xl font-bold mb-6 text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                        Start Your Conversation
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                        Your future self is ready to chat! Ask about investments, spending decisions, or life goals. Get advice that's personal, actionable, and backed by your real financial data.
                      </p>
                      
                      {/* Chat Preview */}
                      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-4 border border-gray-300">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">45</span>
                          </div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">"Ready to talk about your financial future?"</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visual Element */}
                  <div className="order-1 lg:order-2">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-12 border border-gray-300">
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                          <div className="space-y-4">
                            {/* User Message */}
                            <div className="flex justify-end">
                              <div className="bg-[#725BF4] text-white rounded-2xl px-4 py-2 max-w-xs">
                                <div className="text-sm">Should I increase my SIP amount?</div>
                              </div>
                            </div>
                            
                            {/* Future Self Response */}
                            <div className="flex justify-start">
                              <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-xs">
                                <div className="text-sm text-gray-800">Based on your Fi Money data, yes! You can afford ₹5K more...</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 text-center">
                            <div className="inline-flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
                              <Rocket className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700 font-medium">Conversation started!</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-[#725BF4] rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div className="w-8 h-8 bg-[#00A175] rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </div>
              <span className="text-gray-700 font-medium">Complete setup in under 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section - NEW */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                Try a <span className="text-[#725BF4]">Live</span> Demo
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                See how your future self responds to real financial decisions. Click through different scenarios to experience the magic.
              </p>
            </div>

            {/* Interactive Demo */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              {/* Demo Tabs */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {demoScenarios.map((scenario, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDemo(index)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeDemo === index
                        ? 'bg-[#725BF4] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Scenario {index + 1}
                  </button>
                ))}
              </div>

              {/* Demo Content */}
              <div className="space-y-6">
                {/* User Question */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#725BF4] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">You</span>
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-6 py-4 max-w-2xl">
                    <p className="text-gray-800 font-medium">
                      {demoScenarios[activeDemo].question}
                    </p>
                  </div>
                </div>

                {/* Future Self Response */}
                <div className="flex items-start space-x-4 justify-end">
                  <div className="bg-[#00A175] bg-opacity-10 border border-[#00A175] border-opacity-20 rounded-2xl px-6 py-4 max-w-2xl text-right">
                    <p className="text-gray-800 mb-4">
                      {demoScenarios[activeDemo].response}
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-white/80 rounded-full px-4 py-2">
                      <Target className="w-4 h-4 text-[#00A175]" />
                      <span className={`font-bold ${demoScenarios[activeDemo].color}`}>
                        {demoScenarios[activeDemo].impact}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-[#00A175] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">45</span>
                  </div>
                </div>
              </div>

              {/* Demo CTA */}
              <div className="text-center mt-8 pt-8 border-t border-gray-200">
                <p className="text-gray-600 mb-4">Ready to have your own conversation?</p>
                <Button
                  onClick={handleGetStarted}
                  disabled={loading}
                  className="bg-[#00A175] hover:bg-[#008a64] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <>
                      {user ? 'Continue Journey' : 'Start Your Journey'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional CTA Section - Updated */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Content */}
              <div className="order-2 lg:order-1">
                <div className="space-y-8">
                  {/* Main Heading */}
                  <h2 className="text-5xl md:text-6xl font-bold leading-tight text-white">
                    Ready to Meet<br/>
                    <span className="text-[#00A175] mt-2">Your Future{" "}</span>
                    Self?
                  </h2>
                  
                  {/* Description */}
                  <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                    Transform your financial future with AI-powered guidance. Start conversations that could change your life - literally.
                  </p>
                  
                  {/* Feature List */}
                  <div className="space-y-4">
                    {[
                      { icon: Clock, text: "Setup in under 2 minutes", color: "text-[#00A175]" },
                      { icon: CreditCard, text: "No credit card required", color: "text-[#725BF4]" },
                      { icon: UserCheck, text: "Bank-level security", color: "text-gray-300" }
                    ].map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div key={index} className="flex items-center space-x-4 group">
                          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all duration-300">
                            <IconComponent className={`w-6 h-6 ${feature.color}`} />
                          </div>
                          <span className="text-white/90 font-medium text-lg">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* CTA Button */}
                  <div className="pt-8">
                    <Button
                      onClick={handleGetStarted}
                      disabled={loading}
                      className="group relative bg-gradient-to-r from-[#00A175] to-[#008a64] hover:from-[#008a64] hover:to-[#00A175] text-white font-bold text-xl px-12 py-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-[#00A175]/25 hover:scale-105 border-0 disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-3">
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                        )}
                        <span>{user ? 'Continue Your Journey' : 'Start Your Journey'}</span>
                        {!loading && <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />}
                      </div>
                      
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00A175] to-[#008a64] rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Interactive Visual */}
              <div className="order-1 lg:order-2">
                <div className="relative">
                  {/* Main Card */}
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-3">
                        <img src="/ff_logo.png" alt="Future Self Logo" className="w-10 h-10 rounded-xl" />
                        <div>
                          <div className="text-white font-bold text-lg">Future Self</div>
                          <div className="text-white/60 text-sm">AI Financial Advisor</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-[#00A175]/20 border border-[#00A175]/30 rounded-full px-4 py-2">
                        <div className="w-2 h-2 bg-[#00A175] rounded-full animate-pulse"></div>
                        <span className="text-[#00A175] text-sm font-medium">Online</span>
                      </div>
                    </div>
                    
                    {/* Chat Preview */}
                    <div className="space-y-6">
                      {/* Future Self Message */}
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-[#725BF4] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">45</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-6 py-4 max-w-sm">
                          <p className="text-white text-sm leading-relaxed">
                            Hey! I've been analyzing your spending patterns. Want to know how that daily ₹200 coffee habit affects our retirement? 😊
                          </p>
                        </div>
                      </div>
                      
                      {/* User Response Options */}
                      <div className="flex justify-end">
                        <div className="space-y-3 max-w-xs">
                          <button className="w-full bg-[#725BF4]/20 hover:bg-[#725BF4]/30 border border-[#725BF4]/40 rounded-2xl px-4 py-3 text-white text-sm font-medium transition-all duration-200 hover:scale-105">
                            Tell me more! ☕
                          </button>
                          <button className="w-full bg-[#725BF4]/20 hover:bg-[#725BF4]/30 border border-[#725BF4]/40 rounded-2xl px-4 py-3 text-white text-sm font-medium transition-all duration-200 hover:scale-105">
                            Show me alternatives
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Interactive Technology Showcase */}
                    <div className="mt-8 pt-6 border-t border-white/20">
                      {/* Active Tech Description */}
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <div className="text-center">
                          <div className="text-white font-semibold text-sm mb-1">
                            {techFeatures[activeTech].title}
                          </div>
                          <div className="text-white/70 text-xs">
                            {techFeatures[activeTech].description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Product Value Proposition */}
            <div className="mt-20 pt-12 border-t border-white/20">
              <div className="text-center">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="group">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                      <DollarSign className="w-8 h-8 text-[#00A175]" />
                    </div>
                    <div className="text-white font-semibold mb-2">Smart Financial Decisions</div>
                    <div className="text-white/60 text-sm">Make informed choices backed by real data and future projections</div>
                  </div>
                  
                  <div className="group">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                      <PieChart className="w-8 h-8 text-[#725BF4]" />
                    </div>
                    <div className="text-white font-semibold mb-2">Personalized Insights</div>
                    <div className="text-white/60 text-sm">Get advice tailored to your unique financial situation and goals</div>
                  </div>
                  
                  <div className="group">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-white font-semibold mb-2">Long-term Planning</div>
                    <div className="text-white/60 text-sm">Build wealth systematically with guidance from your future self</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className=" bg-[#725BF4] rounded-xl flex items-center justify-center">
                  <img src="/ff_logo.png" alt="Future Self Logo" className="w-10 h-10 rounded-xl" />
              </div>
              <span className="text-xl font-bold text-gray-900">Future Self</span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2024 Future Self. Built with ❤️ for your financial future.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}