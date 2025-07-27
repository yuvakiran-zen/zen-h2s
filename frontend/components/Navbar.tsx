"use client";

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Sparkles, 
  MessageCircle,
  Target,
  TrendingUp,
  BarChart3,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '@/lib/supabase-auth';
import { useState } from 'react';
import Image from 'next/image';

interface NavbarProps {
  className?: string;
}

export default function Navbar({
  className = ""
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Determine page type
  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/auth';
  const isAppPage = !isLandingPage && !isAuthPage;
  
  // Get current page info
  const getCurrentPageInfo = () => {
    switch (pathname) {
      case '/': return { title: '', showTitle: false };
      case '/auth': return { title: 'Sign In', showTitle: false };
      case '/connect': return { title: 'Connect Accounts', showTitle: true };
      case '/onboarding': return { title: 'Setup Profile', showTitle: true };
      case '/chat': return { title: 'Chat', showTitle: true };
      case '/actions': return { title: 'Action Center', showTitle: true };
      case '/scenarios': return { title: 'Scenarios', showTitle: true };
      case '/progress': return { title: 'Progress', showTitle: true };
      case '/profile': return { title: 'Profile', showTitle: true };
      default: return { title: 'App', showTitle: true };
    }
  };

  const { title, showTitle } = getCurrentPageInfo();

  // App navigation items
  const appNavItems = [
    { name: 'Chat', href: '/chat', icon: MessageCircle, current: pathname === '/chat' },
    { name: 'Actions', href: '/actions', icon: Target, current: pathname === '/actions' },
    { name: 'Scenarios', href: '/scenarios', icon: TrendingUp, current: pathname === '/scenarios' },
    { name: 'Progress', href: '/progress', icon: BarChart3, current: pathname === '/progress' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const handleAuthAction = (action: 'login' | 'signup') => {
    router.push('/auth');
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className={`border-b border-gray-100 bg-white ${className}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#725BF4] to-[#5d47d9] rounded-xl flex items-center justify-center shadow-lg p-1">
                <Image 
                  src="/ff_logo.png" 
                  alt="Future Self Logo" 
                  className="w-full h-full object-contain rounded-lg"
                  width={10}
                  height={10}
                />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {showTitle ? title : 'Future Self'}
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-8">
            {/* Landing Page Navigation */}
            {isLandingPage && (
              <div className="flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">How It Works</a>
                {/* <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Reviews</a> */}
              </div>
            )}

            {/* App Navigation for authenticated users */}
            {isAppPage && user && (
              <div className="hidden lg:flex items-center space-x-2">
                {appNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      variant={item.current ? "default" : "ghost"}
                      className={`flex items-center space-x-2 rounded-xl transition-all duration-200 ${
                        item.current 
                          ? 'bg-gradient-to-r from-[#725BF4] to-[#5d47d9] text-white shadow-lg' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {user ? (
                /* Authenticated User - Only Profile Dropdown */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-10 w-10 rounded-full hover:bg-gray-100"
                    >
                      <Avatar className="h-8 w-8 lg:h-9 lg:w-9">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#725BF4] to-[#5d47d9] text-white text-sm font-semibold">
                          {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <div className="flex items-center justify-start gap-3 p-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#725BF4] to-[#5d47d9] text-white">
                          {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">{user?.user_metadata?.full_name || user?.email || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                          {user?.email || 'user@email.com'}
                        </p>
                        {profile && (
                          <Badge variant="secondary" className="text-xs w-fit mt-1">
                            Profile Complete
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleNavigation('/profile')}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                /* Unauthenticated User - Login/Signup Buttons */
                <div className="hidden md:flex items-center space-x-3">
                  <Button 
                    onClick={() => handleAuthAction('login')}
                    variant="ghost" 
                    className="text-gray-600 hover:text-gray-900 font-semibold rounded-xl"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => handleAuthAction('signup')}
                    className="bg-gradient-to-r from-[#725BF4] to-[#5d47d9] hover:from-[#5d47d9] hover:to-[#725BF4] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            {(isAppPage && user) || isLandingPage ? (
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </Button>
            ) : (
              !user && (
                <Button 
                  onClick={() => handleAuthAction('login')}
                  size="sm"
                  className="bg-gradient-to-r from-[#725BF4] to-[#5d47d9] text-white rounded-xl"
                >
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            {isAppPage && user && (
              <div className="space-y-2 mb-4">
                {appNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      variant={item.current ? "default" : "ghost"}
                      className={`w-full justify-start space-x-2 rounded-xl ${
                        item.current 
                          ? 'bg-gradient-to-r from-[#725BF4] to-[#5d47d9] text-white' 
                          : 'text-gray-600'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Button>
                  );
                })}
              </div>
            )}

            {isLandingPage && (
              <div className="space-y-2 mb-4">
                <a href="#features" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">Features</a>
                <a href="#how-it-works" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">How It Works</a>
                <a href="#testimonials" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">Reviews</a>
              </div>
            )}

            {!user && (
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <Button 
                  onClick={() => handleAuthAction('login')}
                  variant="ghost" 
                  className="w-full justify-start text-gray-600 hover:text-gray-900 font-semibold"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => handleAuthAction('signup')}
                  className="w-full justify-start bg-gradient-to-r from-[#725BF4] to-[#5d47d9] text-white font-semibold"
                >
                  Get Started
                </Button>
              </div>
            )}

            {user && (
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <Button 
                  onClick={() => handleNavigation('/profile')}
                  variant="ghost" 
                  className="w-full justify-start text-gray-600 hover:text-gray-900"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Button>
                <Button 
                  onClick={handleSignOut}
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}