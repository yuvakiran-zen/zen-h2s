"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, BarChart3, Target, TrendingUp, Menu, User, Bot, Sparkles } from 'lucide-react';
import Avatar from '@/components/Avatar';
import Navbar from '@/components/Navbar';
import { ChatMessage, User as UserType, UserProfile, ChatResponse } from '@/lib/types';

interface ChatInterfaceProps {
  user: UserType;
  userProfile: UserProfile;
  connectedAccounts: string[];
  initialMessages?: ChatMessage[];
  onNavigate: (screen: string) => void;
  onSendMessage?: (message: string, userProfile: UserProfile) => Promise<ChatResponse>;
}

export default function ChatInterface({ 
  user, 
  userProfile, 
  connectedAccounts, 
  initialMessages = [],
  onNavigate,
  onSendMessage 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsAnalyzing(true);

    try {
      if (onSendMessage) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsAnalyzing(false);

        const response = await onSendMessage(inputMessage, userProfile);
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response.message,
          sender: response.sender,
          timestamp: new Date(),
          futureAge: response.futureAge
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Fallback if no onSendMessage provided
        setIsAnalyzing(false);
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "I'm here to help you with your financial questions! (Connect to API for personalized responses)",
          sender: 'ai_assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsAnalyzing(false);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
        sender: 'ai_assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  const getSenderInfo = (message: ChatMessage) => {
    switch (message.sender) {
      case 'user':
        return {
          name: 'You',
          avatar: user.avatar,
          bgColor: 'bg-[#725BF4]',
          textColor: 'text-white',
          bubbleColor: 'bg-[#725BF4] text-white'
        };
      case 'future_self':
        return {
          name: `Future You (${message.futureAge})`,
          avatar: null,
          bgColor: 'bg-[#00A175]',
          textColor: 'text-black',
          bubbleColor: 'bg-[#00A175] bg-opacity-10 border border-[#00A175] border-opacity-20 text-gray-800'
        };
      case 'ai_assistant':
        return {
          name: 'AI Assistant',
          avatar: null,
          bgColor: 'bg-gray-600',
          textColor: 'text-white',
          bubbleColor: 'bg-gray-50 border border-gray-200 text-gray-800'
        };
      default:
        return {
          name: 'Unknown',
          avatar: null,
          bgColor: 'bg-gray-500',
          textColor: 'text-white',
          bubbleColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />

      {/* Chat Messages */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome message if no initial messages */}
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[#00A175] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">{userProfile.futureAge}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Start a conversation with your future self
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Ask questions about your financial future, investments, or any money decisions you're considering.
              </p>
            </div>
          )}

          <div className="space-y-8 mb-8">
            {messages.map((message) => {
              const senderInfo = getSenderInfo(message);
              const isUser = message.sender === 'user';
              
              return (
                <div key={message.id} className={`flex items-start space-x-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${senderInfo.bgColor}`}>
                    {message.sender === 'user' ? (
                      senderInfo.avatar ? (
                        <img src={senderInfo.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )
                    ) : message.sender === 'future_self' ? (
                      <div className="text-white font-bold text-sm">{message.futureAge}</div>
                    ) : (
                      <Bot className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`max-w-2xl ${isUser ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-semibold text-gray-700">{senderInfo.name}</span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className={`rounded-2xl px-6 py-4 ${senderInfo.bubbleColor}`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Loading/Analyzing State */}
            {isLoading && (
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#00A175] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-white font-bold text-sm">{userProfile.futureAge}</div>
                </div>
                <div className="max-w-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-semibold text-gray-700">Future You ({userProfile.futureAge})</span>
                  </div>
                  <div className="rounded-2xl px-6 py-4 bg-[#00A175] bg-opacity-10 border border-[#00A175] border-opacity-20">
                    {isAnalyzing ? (
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#00A175] rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-[#00A175] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-[#00A175] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-gray-700">Analyzing your {connectedAccounts.join(' & ')} data...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#00A175] rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-[#00A175] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-[#00A175] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-gray-700">Thinking...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your future self anything about finances..."
                  className="h-14 pr-16 rounded-2xl border-2 border-gray-200 focus:border-[#725BF4] bg-white text-base"
                  disabled={isLoading}
                />
                <Button
                  onClick={toggleVoice}
                  variant="ghost"
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full ${
                    isVoiceActive ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {isVoiceActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="h-14 w-14 rounded-full bg-[#725BF4] hover:bg-[#5d47d9] text-white border-0 transition-all duration-200 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex justify-center mt-4">
              <p className="text-xs text-gray-500 text-center max-w-2xl">
                Your future self has access to your {connectedAccounts.join(' & ')} data to provide personalized advice. 
                All conversations are private and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}