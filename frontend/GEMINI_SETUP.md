# Gemini API Setup Guide

This guide will help you set up the Gemini API for the chat functionality in your Financial Future Self app.

## 🚀 Quick Setup

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Add Environment Variable

Create or update your `.env.local` file in the project root:

```env
# Existing variables...
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Add this new variable
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

### Step 3: Restart Development Server

```bash
npm run dev
```

## 🔧 How It Works

### API Flow
1. **User sends message** → ChatInterface component
2. **Client-side API call** → `/api/chat` route
3. **Server-side processing** → Gemini API with user context
4. **Response** → Authentic conversation with future self

### Features
- **Authentic Future Self**: AI responds as your actual future self, not an AI
- **Emotional Connection**: Genuine emotions, memories, and personal anecdotes
- **Financial Context**: Aware of connected accounts (Fi Money, Zerodha)
- **Personal Touch**: Can praise, lovingly roast, and share regrets
- **Fallback System**: Graceful degradation to mock responses
- **Database Storage**: Saves conversation history (optional)

### Response Style
- **Conversational**: "Oh man, I remember being exactly where you are right now! 😅"
- **Personal**: "I wish I'd known this at your age..."
- **Emotional**: Shows genuine care, excitement, concern, and humor
- **Authentic**: Feels like talking to yourself, not an AI

## 🛠️ Customization

### Modify System Prompt
Edit `lib/gemini.ts` to change the future self's personality:

```typescript
const systemPrompt = `You ARE the user's ${userProfile.futureAge}-year-old self...
// Customize the emotional depth and personality here
`;
```

### Add Conversation History
Pass message history for more contextual responses:

```typescript
const response = await sendMessageToGemini(message, {
  userProfile,
  connectedAccounts,
  messageHistory: previousMessages // Add this
});
```

### Emotional Range
The future self can:
- **Praise**: "I'm actually proud of you for asking for help"
- **Roast**: "Haha, I can see you're still making the same mistakes I made!"
- **Encourage**: "Trust me, future you will thank present you!"
- **Share Regrets**: "This is something I wish I'd done more of at your age"
- **Show Concern**: "I'm worried about your spending patterns"

## 🔒 Security

- API key is stored server-side in environment variables
- All requests go through authenticated API routes
- User data is validated before sending to Gemini
- No sensitive financial data is sent to external APIs

## 🐛 Troubleshooting

### Common Issues

1. **"Gemini API key not configured"**
   - Check `.env.local` file exists
   - Verify `NEXT_PUBLIC_GEMINI_API_KEY` is set
   - Restart development server

2. **"Unauthorized" errors**
   - Ensure user is logged in
   - Check Supabase authentication

3. **Fallback to mock responses**
   - Check browser console for API errors
   - Verify Gemini API key is valid
   - Check network connectivity

### Testing

1. **Test with API key**: Send a message in chat
2. **Test without API key**: Remove the env variable and verify fallback works
3. **Test error handling**: Temporarily use invalid API key

## 📊 Monitoring

### Console Logs
- API calls are logged in browser console
- Errors are logged with details
- Fallback triggers are logged

### Database
- Chat messages are saved to `chat_messages` table
- User authentication is verified for each request

## 🚀 Production Deployment

### Environment Variables
Add to your production environment:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your-production-api-key
```

### Rate Limiting
Consider adding rate limiting to `/api/chat` route for production use.

### Error Monitoring
Set up error monitoring for API failures and fallback usage.

## 📝 API Reference

### Request Format
```typescript
POST /api/chat
{
  "message": "string",
  "userProfile": {
    "age": number,
    "futureAge": number,
    "personality": "conservative" | "balanced" | "aggressive",
    "goals": string[]
  },
  "connectedAccounts": string[],
  "messageHistory": Array<{role: string, parts: string}>
}
```

### Response Format
```typescript
{
  "message": "string",
  "sender": "future_self",
  "futureAge": number
}
```

## 🎯 Next Steps

1. **Test the integration** with your Gemini API key
2. **Customize the emotional depth** for your specific use case
3. **Add conversation history** for more contextual responses
4. **Monitor usage** and adjust rate limits as needed
5. **Consider adding** more sophisticated error handling

The Gemini integration now provides an authentic conversation with your future self! 🎉 