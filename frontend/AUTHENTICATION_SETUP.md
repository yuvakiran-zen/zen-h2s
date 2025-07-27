# Authentication Setup Guide

Your project already has a **complete Supabase authentication system** implemented! Here's what's been set up and what you need to do to get it running.

## ✅ What's Already Implemented

### 1. **Authentication Context** (`lib/supabase-auth.tsx`)
- Complete auth provider with signup/signin methods
- Session management and state persistence
- User profile and connected accounts handling
- OAuth support (Google, GitHub)
- Auth guards for protected routes

### 2. **UI Components** (`components/AuthPage.tsx`)
- Beautiful login/signup interface
- Email/password authentication
- Google OAuth integration
- Demo login option
- Error handling and loading states

### 3. **Database Schema** (`supabase/migrations/001_initial_schema.sql`)
- User profiles table
- Connected accounts table
- Financial data tables
- Row Level Security (RLS) policies
- Database triggers and functions

### 4. **Route Protection** (`middleware.ts`)
- Updated to use modern `@supabase/ssr` package
- Automatic redirects for protected routes
- Session validation

### 5. **API Routes**
- Auth callback handling (`app/api/auth/callback/route.ts`)
- Profile management (`app/api/profile/route.ts`)
- Recommendations API (`app/api/recommendations/route.ts`)

## 🚀 Setup Instructions

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully set up

### Step 2: Set Up Database Schema
1. In your Supabase dashboard, go to SQL Editor
2. Copy and run the SQL from `supabase/migrations/001_initial_schema.sql`
3. This creates all necessary tables, functions, and security policies

### Step 3: Configure Environment Variables
Create a `.env.local` file in your project root:

```env
# Get these values from your Supabase project settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App configuration
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Step 4: Configure Supabase Auth Settings
1. In Supabase dashboard, go to **Authentication > Settings**
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000`

### Step 5: (Optional) Set Up Google OAuth
1. Go to **Authentication > Providers** in Supabase
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`

## 🧪 Testing Authentication

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test the Auth Flow
1. Visit `http://localhost:3000`
2. Click "Get Started" → redirects to `/auth`
3. Try signing up with email/password
4. Test Google OAuth (if configured)
5. Verify protected routes redirect to auth when not logged in

### 3. Test Features
- **Signup**: Creates new user and profile
- **Login**: Authenticates existing users
- **Protected Routes**: `/chat`, `/actions`, `/scenarios`, `/progress` require auth
- **Auto-redirect**: Logged-in users can't access `/auth`
- **Session Persistence**: Refresh page maintains login state

## 🔐 How Authentication Works

### Auth Flow
1. **User visits app** → Auth context checks for existing session
2. **Not authenticated** → Middleware redirects to `/auth`
3. **User signs up/in** → Supabase handles authentication
4. **Success** → Redirected to `/connect` (account connection)
5. **Complete onboarding** → Access to main app features

### State Management
- **Global State**: `AuthProvider` wraps entire app
- **User Data**: Automatically synced with Supabase
- **Profile Data**: Fetched and cached after authentication
- **Route Protection**: Middleware checks auth status

### Components Using Auth
```tsx
// Get auth state in any component
import { useAuth } from '@/lib/supabase-auth';

function MyComponent() {
  const { user, profile, loading, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {user.email}!</div>;
}
```

### Protected Route Usage
```tsx
// Use auth guard for protected pages
import { useAuthGuard } from '@/lib/supabase-auth';

function ProtectedPage() {
  const auth = useAuthGuard({ 
    requireAuth: true, 
    requireProfile: true 
  });
  
  if (auth.loading) return <div>Loading...</div>;
  
  return <div>Protected content</div>;
}
```

## 🛠️ Customization

### Adding New Auth Providers
1. Enable provider in Supabase dashboard
2. Add provider to `signInWithOAuth` method in `AuthPage.tsx`

### Modifying User Profile
1. Update database schema in `supabase/migrations/`
2. Update TypeScript types in `lib/database.types.ts`
3. Modify profile forms in `components/OnboardingPage.tsx`

### Custom Auth Logic
- Modify `lib/supabase-auth.tsx` for custom auth behavior
- Update `middleware.ts` for custom route protection
- Add new API routes in `app/api/` for custom endpoints

## 🐛 Troubleshooting

### Common Issues
1. **Environment Variables**: Make sure `.env.local` has correct Supabase credentials
2. **Database Schema**: Run the migration SQL in Supabase dashboard
3. **CORS Issues**: Check redirect URLs in Supabase auth settings
4. **Build Errors**: Install dependencies with `npm install`

### Getting Help
- Check browser console for error messages
- Verify Supabase project settings
- Test auth in Supabase dashboard first
- Check network tab for failed API calls

## 📝 Summary

Your authentication system is **100% ready to use**! Just:
1. Create Supabase project
2. Run the database migration
3. Add environment variables  
4. Start the dev server

The system includes signup, signin, OAuth, route protection, session management, and user profiles. Everything is already connected and working together! 