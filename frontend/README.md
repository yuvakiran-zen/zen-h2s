# Financial Future Self - AI-Powered Financial Planning

A Next.js application that connects your financial accounts to provide AI-powered financial insights and projections with your "future self."

## Features

- 🔐 **Secure Authentication** - Supabase Auth with Google OAuth and email/password
- 💳 **Account Integration** - Connect Fi Money, Zerodha, and other financial accounts
- 🤖 **AI Chat Interface** - Chat with your future self for financial advice powered by Google Gemini AI
- 📊 **Progress Tracking** - Monitor your financial health and goals
- 🎯 **Action Center** - Personalized recommendations for financial improvement
- 📈 **Scenario Planning** - Explore different financial futures based on your decisions
- 👤 **Profile Management** - Comprehensive user profile and settings

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI Integration**: Google Gemini AI for intelligent financial advice
- **State Management**: React Query for server state
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system

## Architecture Overview

### Database Schema
- **profiles**: User profile information and preferences
- **connected_accounts**: Financial account connections
- **financial_data**: User's financial information
- **recommendations**: AI-generated financial recommendations
- **scenarios**: Financial projection scenarios
- **chat_messages**: Chat history with future self

### Authentication Flow
1. User signs up/signs in via Supabase Auth
2. Profile is automatically created via database trigger
3. User guided through onboarding flow
4. Account connections established
5. AI recommendations generated

### AI Chat Integration
- **Gemini AI**: Google's advanced AI model for personalized financial advice
- **Future Self Persona**: AI responds as user's future self (70% of time)
- **Personalized Context**: Uses user profile, goals, and connected accounts
- **Fallback System**: Graceful degradation to mock responses if API unavailable

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI Studio account (for Gemini API)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd financial-future-self
npm install
```

### 2. Set Up Supabase

#### Create a New Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be fully set up

#### Set Up the Database
1. In your Supabase dashboard, go to the SQL Editor
2. Run the SQL script from `supabase/migrations/001_initial_schema.sql`
3. This will create all necessary tables, functions, and RLS policies

#### Configure Authentication
1. In Supabase dashboard, go to Authentication > Settings
2. Configure Site URL: `http://localhost:3000`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000` (for development)

#### Set Up Google OAuth (Optional)
1. Go to Authentication > Providers in Supabase
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`

### 3. Set Up Gemini AI (Optional but Recommended)

#### Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

#### Add Environment Variable
Add this to your `.env.local` file:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
```

#### Test the Integration
Visit `/test-gemini` in your app to verify the Gemini API integration is working.

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini AI Configuration (Optional)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Application Configuration  
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

To get these values:
1. Go to your Supabase project settings
2. Navigate to API section
3. Copy the Project URL and anon public key
4. Copy the service role key (keep this secret!)

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── chat/          # Gemini AI chat endpoint
│   │   └── ...            # Other API routes
│   ├── auth/              # Authentication pages
│   ├── connect/           # Account connection
│   ├── onboarding/        # User onboarding
│   ├── chat/              # Chat interface
│   ├── actions/           # Action center
│   ├── scenarios/         # Scenario planning
│   ├── progress/          # Progress tracking
│   ├── profile/           # Profile management
│   └── test-gemini/       # Gemini API test page
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── ...               # Feature components
├── lib/                  # Utilities and configurations
│   ├── supabase.ts       # Supabase client
│   ├── supabase-auth.ts  # Authentication hooks
│   ├── gemini.ts         # Gemini AI integration
│   ├── react-query.ts    # React Query setup
│   ├── database.types.ts # TypeScript types
│   └── hooks/            # Custom hooks
├── supabase/
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## Key Features

### Authentication System
- **Supabase Auth**: Email/password and OAuth providers
- **Protected Routes**: Automatic redirects for unauthenticated users
- **Profile Management**: Complete user profile system
- **Session Management**: Persistent sessions with automatic refresh

### AI Chat System
- **Gemini AI Integration**: Advanced AI-powered financial advice
- **Future Self Persona**: AI responds as user's future self
- **Personalized Context**: Uses user profile, goals, and financial data
- **Fallback System**: Graceful degradation when AI unavailable
- **Conversation History**: Persistent chat history in database

### Database Integration
- **Row Level Security**: Secure data access per user
- **Real-time Updates**: Live data synchronization
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Comprehensive error boundaries

### UI/UX Features
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loaders and progress indicators
- **Error States**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation

## API Routes

### Authentication
- `POST /api/auth/callback` - OAuth callback handler

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile` - Create user profile

### AI Chat
- `POST /api/chat` - Send message to Gemini AI and get response

### Recommendations
- `GET /api/recommendations` - Get user recommendations
- `POST /api/recommendations` - Create recommendation

## AI Integration Details

### How the AI Works
1. **User sends message** → ChatInterface component
2. **API call** → `/api/chat` route with user context
3. **Gemini processing** → AI generates personalized response
4. **Response** → Future self or AI assistant persona

### AI Features
- **Personalized Responses**: Uses user age, goals, personality, and financial data
- **Financial Context**: Aware of connected accounts (Fi Money, Zerodha)
- **Future Self Persona**: 70% of responses come from user's future self
- **Smart Fallbacks**: Graceful degradation to mock responses if AI unavailable

### Customization
- **System Prompt**: Modify `lib/gemini.ts` to change AI personality
- **Response Distribution**: Adjust future self vs AI assistant ratio
- **Conversation History**: Add message history for more contextual responses

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow Next.js 14 app directory conventions
- Use Tailwind CSS for styling
- Implement proper error handling

### Database Queries
- Use React Query for all data fetching
- Implement optimistic updates where appropriate
- Cache data appropriately
- Handle loading and error states

### Security
- Never expose service role keys in client code
- Use RLS policies for data access control
- Validate all user inputs
- Implement proper CORS settings

### AI Integration
- Keep API keys secure in environment variables
- Implement proper error handling for AI failures
- Test fallback systems thoroughly
- Monitor API usage and costs

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Update Supabase redirect URLs for production domain
4. Deploy

### Environment Variables for Production
Update your production environment variables and Supabase settings:
- Site URL: `https://your-domain.com`
- Redirect URLs: `https://your-domain.com/auth/callback`
- Add `NEXT_PUBLIC_GEMINI_API_KEY` for AI functionality

## Testing

### Test Gemini Integration
Visit `/test-gemini` in your app to verify the AI integration is working properly.

### Manual Testing
1. **With API key**: Send messages in chat to test AI responses
2. **Without API key**: Remove env variable to test fallback system
3. **Error handling**: Use invalid API key to test error scenarios

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 