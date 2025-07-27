"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { testGeminiConnection } from '@/lib/gemini';

export default function TestGeminiPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult('Testing Gemini API connection...');
    
    try {
      const success = await testGeminiConnection();
      setTestResult(success 
        ? '✅ Gemini API test successful! The integration is working properly.' 
        : '❌ Gemini API test failed. Check the console for details.'
      );
    } catch (error) {
      setTestResult(`❌ Test error: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Gemini API Integration Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-600">
                <p className="mb-4">
                  This page tests the Gemini API integration for the chat functionality.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Setup Required:</h3>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Get a Gemini API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                    <li>2. Add <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_GEMINI_API_KEY=your-key</code> to your <code className="bg-blue-100 px-1 rounded">.env.local</code> file</li>
                    <li>3. Restart your development server</li>
                    <li>4. Click the test button below</li>
                  </ol>
                </div>
              </div>

              <Button 
                onClick={handleTest}
                disabled={isTesting}
                className="w-full bg-[#725BF4] hover:bg-[#5d47d9] text-white"
              >
                {isTesting ? 'Testing...' : 'Test Gemini API Connection'}
              </Button>

              {testResult && (
                <div className={`p-4 rounded-lg border ${
                  testResult.includes('✅') 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <p className="font-medium">{testResult}</p>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">What this test does:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Verifies your Gemini API key is valid</li>
                  <li>• Tests the API connection and response</li>
                  <li>• Checks the integration with your app's chat system</li>
                  <li>• Logs results to browser console for debugging</li>
                </ul>
              </div>

              <div className="text-center">
                <a 
                  href="/chat" 
                  className="text-[#725BF4] hover:text-[#5d47d9] font-medium"
                >
                  ← Back to Chat
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 