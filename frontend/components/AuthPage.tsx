"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Sparkles, Chrome, Zap, Shield, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';

interface AuthPageProps {
  onBack: () => void;
}

export default function AuthPage({ onBack }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signInWithEmail, signUpWithEmail, signInWithOAuth } = useAuth();
  const router = useRouter();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    const { error } = await signInWithOAuth('google');
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Redirect will happen automatically after successful OAuth
      router.push('/connect');
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    setError(null);
    
    const { error } = isLogin 
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      router.push('/connect');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    // Use demo credentials for quick testing
    const { error } = await signInWithEmail('demo@futureself.ai', 'demo123456');
    
    if (error) {
      setError('Demo account not available. Please use your own credentials.');
    } else {
      router.push('/connect');
    }
    
    setIsLoading(false);
  };



  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Benefits */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight text-gray-900">
                  Welcome to your
                  <span className="block text-[#725BF4] mt-1">
                    Financial Future
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Join thousands of users who are building wealth with AI-powered guidance from their future selves.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#00A175] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Bank-level Security</h3>
                    <p className="text-gray-600 text-sm">Your data is encrypted and protected with industry-leading security</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#725BF4] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Instant Setup</h3>
                    <p className="text-gray-600 text-sm">Get started in under 2 minutes with our streamlined process</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">10,000+ Happy Users</h3>
                    <p className="text-gray-600 text-sm">Join our growing community of financially empowered individuals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <Card className="border border-gray-200 rounded-2xl shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {isLogin ? 'Welcome Back!' : 'Create Account'}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {isLogin ? 'Sign in to continue your financial journey' : 'Start building your financial future today'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Demo Login Banner */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                    <p className="text-yellow-800 text-sm mb-3 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Try the demo:
                    </p>
                    <Button 
                      onClick={handleDemoLogin}
                      disabled={isLoading}
                      className="bg-[#725BF4] hover:bg-[#5d47d9] text-white font-semibold w-full rounded-xl transition-all duration-200 h-10"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Quick Demo Login
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500">or continue with</span>
                    </div>
                  </div>

                  {/* Google Auth */}
                  <Button 
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3" />
                    ) : (
                      <Chrome className="w-5 h-5 mr-3" />
                    )}
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500">or use email & password</span>
                    </div>
                  </div>

                  {/* Email & Password */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="h-12 border-2 border-gray-200 focus:border-[#725BF4] rounded-xl mt-1 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isLogin ? "Enter your password" : "Create a password (min 6 characters)"}
                        className="h-12 border-2 border-gray-200 focus:border-[#725BF4] rounded-xl mt-1 transition-colors"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleEmailAuth}
                      disabled={!email || !password || isLoading}
                      className="w-full h-12 bg-[#00A175] hover:bg-[#008a64] text-white border-0 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      ) : (
                        <Mail className="w-5 h-5 mr-3" />
                      )}
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                  </div>

                  <div className="text-center">
                    <button 
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                    >
                      {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-[#725BF4] hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#725BF4] hover:underline">Privacy Policy</a>.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-[#725BF4] rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Future Self</span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2024 Future Self. Built with ❤️ for your financial future.
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}