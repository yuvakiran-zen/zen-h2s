# Deployment Guide

This guide covers deploying the Financial Future Self application to production with Supabase and Vercel.

## Pre-Deployment Checklist

### 1. Supabase Production Setup
- [ ] Create production Supabase project
- [ ] Run database migrations
- [ ] Configure authentication providers
- [ ] Set up RLS policies
- [ ] Configure CORS settings
- [ ] Set up backups

### 2. Environment Variables
- [ ] Set production environment variables
- [ ] Configure OAuth redirect URLs
- [ ] Update site URLs in Supabase

### 3. Code Preparation
- [ ] Remove console.logs and debug code
- [ ] Run tests
- [ ] Check TypeScript compilation
- [ ] Verify build process

## Deployment Steps

### 1. Supabase Production Setup

#### Create Production Project
```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project (if not done)
supabase init

# Link to your production project
supabase link --project-ref your-production-project-ref
```

#### Deploy Database Schema
```bash
# Push migrations to production
supabase db push

# Or run the SQL manually in Supabase dashboard
```

#### Configure Authentication
1. Go to Authentication > Settings in Supabase dashboard
2. Set Site URL: `https://your-domain.com`
3. Add Redirect URLs:
   - `https://your-domain.com/auth/callback`
   - `https://your-domain.com`

#### Set Up OAuth Providers
For Google OAuth:
1. Go to Authentication > Providers
2. Enable Google provider
3. Add production OAuth credentials
4. Set redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`

### 2. Vercel Deployment

#### Initial Setup
1. Connect your GitHub repository to Vercel
2. Import the project
3. Configure build settings (Next.js should auto-detect)

#### Environment Variables
Add these environment variables in Vercel dashboard:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Application Configuration
NEXTAUTH_SECRET=your-secure-secret
NEXTAUTH_URL=https://your-domain.com
```

#### Build Configuration
Create `vercel.json` (if needed):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 3. Domain Configuration

#### Custom Domain Setup
1. Add custom domain in Vercel dashboard
2. Configure DNS records as instructed
3. Enable automatic HTTPS
4. Update Supabase URLs

#### Update Supabase Settings
After domain is configured:
1. Update Site URL to `https://your-domain.com`
2. Update redirect URLs
3. Test authentication flows

### 4. Post-Deployment Setup

#### Database Seeding (if needed)
```bash
# Run any seed scripts
npm run seed:production
```

#### Monitoring Setup
1. Enable Vercel Analytics
2. Set up error monitoring (Sentry, etc.)
3. Configure logging
4. Set up uptime monitoring

#### Performance Optimization
1. Enable Vercel Speed Insights
2. Configure caching headers
3. Optimize images
4. Set up CDN for static assets

## Environment-Specific Configuration

### Development
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
NEXTAUTH_URL=http://localhost:3000
```

### Staging
```env
NEXT_PUBLIC_SUPABASE_URL=your_staging_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_staging_anon_key
NEXTAUTH_URL=https://staging.your-domain.com
```

### Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXTAUTH_URL=https://your-domain.com
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use different keys for each environment
- Rotate keys regularly
- Store sensitive keys securely

### 2. Supabase Security
- Enable RLS on all tables
- Use service role key only on server-side
- Regularly audit database permissions
- Monitor authentication logs

### 3. Application Security
- Enable HTTPS everywhere
- Set secure headers
- Implement rate limiting
- Regular security audits

## Monitoring and Maintenance

### 1. Application Monitoring
```javascript
// Add to your app for error tracking
if (process.env.NODE_ENV === 'production') {
  // Initialize error tracking
  // e.g., Sentry.init({ dsn: process.env.SENTRY_DSN });
}
```

### 2. Database Monitoring
- Monitor query performance
- Track connection counts
- Set up alerts for errors
- Regular backup verification

### 3. Performance Monitoring
- Core Web Vitals tracking
- API response times
- Database query performance
- User experience metrics

## Troubleshooting

### Common Issues

#### Authentication Errors
1. Check redirect URLs match exactly
2. Verify environment variables
3. Check OAuth provider settings
4. Validate domain configuration

#### Database Connection Issues
1. Verify connection strings
2. Check RLS policies
3. Validate environment variables
4. Monitor connection limits

#### Build/Deploy Issues
1. Check build logs
2. Verify dependencies
3. Check TypeScript errors
4. Validate API routes

### Debug Commands
```bash
# Check Supabase connection
supabase status

# Validate environment
npm run build

# Check types
npm run type-check

# Run tests
npm test
```

## Rollback Procedures

### 1. Application Rollback
1. Revert to previous Vercel deployment
2. Update DNS if needed
3. Notify users of any issues

### 2. Database Rollback
1. Use Supabase backups
2. Run rollback migrations
3. Update application if needed

### 3. Environment Rollback
1. Revert environment variables
2. Update OAuth settings
3. Test functionality

## Backup Strategy

### 1. Database Backups
- Daily automatic backups via Supabase
- Weekly manual backups
- Test restore procedures monthly

### 2. Code Backups
- Git repository (primary)
- Regular GitHub backups
- Local copies for critical releases

### 3. Configuration Backups
- Document all environment variables
- Export Supabase settings
- Save OAuth configurations

## Success Criteria

After deployment, verify:
- [ ] Authentication works correctly
- [ ] All pages load without errors
- [ ] Database connections established
- [ ] API routes functioning
- [ ] OAuth providers working
- [ ] Mobile responsiveness
- [ ] Performance metrics acceptable
- [ ] Security headers present
- [ ] SSL certificate valid
- [ ] Monitoring active

## Support Contacts

- **Supabase Support**: [support@supabase.com](mailto:support@supabase.com)
- **Vercel Support**: [support@vercel.com](mailto:support@vercel.com)
- **Development Team**: [your-team@company.com](mailto:your-team@company.com)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment) 