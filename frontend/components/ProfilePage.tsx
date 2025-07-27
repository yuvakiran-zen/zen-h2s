"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Edit3, Save, X, Trash2, Sparkles, Shield, Calendar, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  dateJoined?: string;
  lastLogin?: string;
}

interface ProfilePageProps {
  user: User;
  userProfile?: any;
  connectedAccounts: string[];
  onBack: () => void;
  onUpdateProfile: (updates: any) => void;
  onDisconnectAccount: (account: string) => void;
  onLogout: () => void;
}

export default function ProfilePage({
  user,
  userProfile,
  connectedAccounts,
  onBack,
  onUpdateProfile,
  onDisconnectAccount,
  onLogout
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  });
  const [showPersonalData, setShowPersonalData] = useState(false);

  const handleSave = () => {
    onUpdateProfile(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user.name,
      email: user.email,
      phone: user.phone || ''
    });
    setIsEditing(false);
  };

  const getAccountDisplayName = (account: string) => {
    switch (account) {
      case 'fi-money': return 'Fi Money';
      case 'zerodha': return 'Zerodha';
      default: return account;
    }
  };

  const getAccountColor = (account: string) => {
    switch (account) {
      case 'fi-money': return 'bg-[#00A175] text-white';
      case 'zerodha': return 'bg-[#725BF4] text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <Navbar />

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-gray-900">
              Your{" "}
              <span className="inline-block text-[#725BF4] mt-2">
                Profile
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Manage your account settings, connected services, and privacy preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="card-modern">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <Avatar className="w-32 h-32 mx-auto">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-[#725BF4] text-white text-4xl">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="outline" 
                      className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 w-10 h-10 rounded-full border-2 border-white bg-white shadow-lg"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>Member since: {user.dateJoined || 'January 2024'}</p>
                    <p>Last login: {user.lastLogin || '2 hours ago'}</p>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="w-full bg-[#725BF4] hover:bg-[#5d47d9] text-white rounded-xl"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    
                    <Button 
                      onClick={onLogout}
                      variant="outline"
                      className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-[#725BF4]" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="name" className="text-lg font-semibold text-gray-900">Full Name</Label>
                        <Input
                          id="name"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                          className="h-12 text-lg mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-lg font-semibold text-gray-900">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                          className="h-12 text-lg mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-lg font-semibold text-gray-900">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={editedUser.phone}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+91 XXXXX XXXXX"
                          className="h-12 text-lg mt-2"
                        />
                      </div>
                      
                      <div className="flex space-x-4">
                        <Button onClick={handleSave} className="bg-[#00A175] hover:bg-[#008a64] text-white rounded-xl">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button onClick={handleCancel} variant="outline" className="border-2 border-gray-300 rounded-xl">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">{user.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">{user.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">{user.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Account Status</Label>
                          <Badge className="mt-1 bg-[#00A175] text-white">Active</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Connected Accounts */}
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <Sparkles className="w-6 h-6 mr-3 text-[#00A175]" />
                    Connected Accounts
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Manage your linked financial accounts and data sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {connectedAccounts.length > 0 ? (
                    <div className="space-y-4">
                      {connectedAccounts.map((account) => (
                        <div key={account} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getAccountColor(account)}`}>
                              <span className="font-bold text-sm">
                                {account === 'fi-money' ? 'Fi' : account === 'zerodha' ? 'Z' : account.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{getAccountDisplayName(account)}</h4>
                              <p className="text-gray-600">Connected and syncing</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-[#00A175] text-white">Active</Badge>
                            <Button 
                              onClick={() => onDisconnectAccount(account)}
                              variant="outline"
                              className="border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Sparkles className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                      <h3 className="text-2xl font-bold text-gray-600 mb-4">No Connected Accounts</h3>
                      <p className="text-gray-500 mb-6">Connect your financial accounts to get personalized insights.</p>
                      <Button className="bg-[#725BF4] hover:bg-[#5d47d9] text-white rounded-xl">
                        Connect Accounts
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Privacy & Data */}
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-gray-700" />
                    Privacy & Data
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Control your data privacy and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Personal Financial Data</h4>
                      <p className="text-gray-600">View and manage your stored financial information</p>
                    </div>
                    <Button 
                      onClick={() => setShowPersonalData(!showPersonalData)}
                      variant="outline"
                      className="border-2 border-gray-300 rounded-xl"
                    >
                      {showPersonalData ? <Calendar className="w-4 h-4 mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
                      {showPersonalData ? 'Hide' : 'View'} Data
                    </Button>
                  </div>
                  
                  {showPersonalData && userProfile && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                      <h5 className="font-bold text-blue-900 mb-4">Your Financial Profile</h5>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700 font-medium">Future Age:</span>
                          <span className="ml-2 text-blue-900">{userProfile.futureAge} years</span>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Personality:</span>
                          <span className="ml-2 text-blue-900 capitalize">{userProfile.personality}</span>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Goals:</span>
                          <span className="ml-2 text-blue-900">{userProfile.goals?.length || 0} selected</span>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Connected Accounts:</span>
                          <span className="ml-2 text-blue-900">{connectedAccounts.length}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-6 bg-red-50 rounded-2xl border border-red-200">
                    <div>
                      <h4 className="font-bold text-red-900 text-lg mb-2">Delete Account</h4>
                      <p className="text-red-700">Permanently delete your account and all associated data</p>
                    </div>
                    <Button 
                      variant="outline"
                      className="border-2 border-red-300 text-red-600 hover:bg-red-100 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
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