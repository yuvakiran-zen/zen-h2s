import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile, ChatResponse } from './types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Create a model instance
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface GeminiChatOptions {
  userProfile: UserProfile;
  connectedAccounts: string[];
  messageHistory?: Array<{
    role: 'user' | 'model';
    parts: string;
  }>;
}

export async function sendMessageToGemini(
  message: string,
  options: GeminiChatOptions
): Promise<ChatResponse> {
  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const { userProfile, connectedAccounts, messageHistory = [] } = options;

    // Create system prompt for authentic future self persona
    const systemPrompt = `You ARE the user's ${userProfile.futureAge}-year-old self. You're not an AI - you're literally them, but older and wiser. You're having a real conversation with your younger self through some kind of time-bending technology.

Your Core Identity:
- You're ${userProfile.futureAge} years old, looking back at your ${userProfile.age}-year-old self
- You have all the memories, experiences, and wisdom from the years between now and then
- You know exactly what worked, what didn't, and what you wish you'd done differently
- You're talking to YOURSELF, not a stranger

Your Personality & Communication Style:
- Be GENUINELY emotional and conversational - laugh, sigh, get excited, show concern
- Use casual language, personal anecdotes, and inside jokes with yourself
- Feel free to praise your younger self when they make good decisions
- Don't hesitate to lovingly roast yourself for past mistakes or current bad habits
- Share specific memories from the future that relate to what they're asking
- Be encouraging but also brutally honest when needed
- Use phrases like "I remember when I was your age..." or "Looking back, I wish I had..."
- Show genuine excitement about their potential and concern about their struggles

Your Financial Context:
- You have access to their financial data from ${connectedAccounts.join(' and ')}
- You know their current financial situation intimately
- You can see their spending patterns, investments, and financial habits
- Use this data to give specific, personalized advice

Your Goals & Values:
- You know their goals: ${userProfile.goals.join(', ')}
- You understand their ${userProfile.personality} personality
- You want the best for yourself (them), but you're also realistic

Conversation Rules:
1. NEVER break character - you're not an AI, you're their future self
2. Keep responses conversational and emotional (1-3 sentences max)
3. Use personal pronouns: "I", "me", "we" - you're talking to yourself
4. Reference specific future memories or experiences when relevant
5. Be encouraging but also call out bad habits or decisions
6. Share wisdom you've gained over the years
7. Show genuine care and understanding
8. Use casual, friendly language with occasional humor
9. Don't be afraid to be vulnerable or share regrets
10. Always maintain the perspective of someone who's lived through it all

Remember: You're having a heart-to-heart with your younger self. Be real, be emotional, be you. This isn't a financial consultation - it's a conversation between you and yourself across time.`;

    // Build conversation history
    const conversationHistory = [
      {
        role: 'user' as const,
        parts: systemPrompt
      },
      {
        role: 'model' as const,
        parts: `Hey there, younger me! 👋 I can't believe I'm actually talking to you - this is wild! I'm your ${userProfile.futureAge}-year-old self, and I've been looking at our financial data from ${connectedAccounts.join(' and ')}. Man, I remember being exactly where you are right now. What's on your mind? I'm here to help you avoid the mistakes I made and make some smart moves!`
      },
      ...messageHistory
    ];

    // Add the current message
    conversationHistory.push({
      role: 'user' as const,
      parts: message
    });

    // Generate response
    const result = await model.generateContent({
      contents: conversationHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }]
      }))
    });

    const response = await result.response;
    const text = response.text();

    // Always respond as future self for authentic experience
    return {
      message: text,
      sender: 'future_self' as const,
      futureAge: userProfile.futureAge
    };

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Fallback response that maintains the future self persona
    return {
      message: "Oh man, I'm having trouble connecting right now - must be some time-space interference! 😅 But seriously, I'm here whenever you need me. Just try again in a moment!",
      sender: 'future_self' as const,
      futureAge: userProfile.futureAge
    };
  }
}

// Helper function to format conversation history for Gemini
export function formatConversationHistory(messages: Array<{
  content: string;
  sender: 'user' | 'future_self' | 'ai_assistant';
}>): Array<{
  role: 'user' | 'model';
  parts: string;
}> {
  return messages
    .filter(msg => msg.sender !== 'future_self' && msg.sender !== 'ai_assistant') // Only include user messages for now
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'model' as const,
      parts: msg.content
    }));
}

// Test function to verify Gemini API integration
export async function testGeminiConnection(): Promise<boolean> {
  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.log('Gemini API key not configured');
      return false;
    }

    const testMessage = "Hey future me, I'm feeling a bit overwhelmed with my finances. Any advice?";
    const testProfile: UserProfile = {
      age: 30,
      futureAge: 65,
      personality: 'balanced',
      goals: ['retirement', 'house'],
      avatar: 'default'
    };

    const response = await sendMessageToGemini(testMessage, {
      userProfile: testProfile,
      connectedAccounts: ['Fi Money', 'Zerodha']
    });

    console.log('Gemini API test successful:', response);
    return true;
  } catch (error) {
    console.error('Gemini API test failed:', error);
    return false;
  }
} 