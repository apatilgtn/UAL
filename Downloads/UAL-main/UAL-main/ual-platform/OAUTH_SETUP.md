# OAuth Authentication Setup Guide

## Overview

This UAL platform now has OAuth authentication integrated using NextAuth.js (Auth.js v5) with Google and GitHub providers. User profiles are stored in a SQLite database using Prisma ORM, and sessions are managed with JWT tokens.

## Prerequisites

Before you can test the authentication, you need to obtain OAuth credentials from Google and GitHub.

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Click "Create Credentials" → "OAuth 2.0 Client ID"
4. Configure the consent screen if prompted
5. Choose "Web application" as the application type
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### 2. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: UAL Platform (or your preferred name)
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID
6. Click "Generate a new client secret" and copy it

### 3. Update Environment Variables

Edit the `.env.local` file in the `ual-platform` directory with your OAuth credentials:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-actual-google-client-id"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-actual-github-client-id"
GITHUB_CLIENT_SECRET="your-actual-github-client-secret"
```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. You'll be automatically redirected to the sign-in page

4. Click either "Continue with Google" or "Continue with GitHub"

5. Complete the OAuth flow

6. You'll be redirected back to the platform dashboard

## Features

### Authentication
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ JWT-based sessions
- ✅ Full platform protection (all routes require authentication)

### User Experience
- ✅ Premium sign-in page with glassmorphism design
- ✅ User avatar and name in navbar
- ✅ Dropdown menu with profile options
- ✅ Smooth sign-out flow

### Database
- ✅ User profiles stored in SQLite database
- ✅ OAuth account linkage
- ✅ Session management

## Database Management

### View Database Contents
```bash
npm run db:studio
```
This opens Prisma Studio in your browser where you can view and manage user data.

### Reset Database
```bash
rm prisma/dev.db
DATABASE_URL="file:./dev.db" npx prisma db push
```

## Testing Checklist

- [ ] Sign in with Google
- [ ] Sign in with GitHub
- [ ] Verify user data in database (use `npm run db:studio`)
- [ ] Check session persistence (refresh page, still logged in)
- [ ] Test sign out
- [ ] Try accessing protected routes while logged out
- [ ] Verify JWT token in browser cookies

## Troubleshooting

### "Configuration error" on sign-in
- Make sure you've replaced the placeholder values in `.env.local` with actual credentials
- Restart the dev server after updating environment variables

### Redirect URI mismatch
- Ensure your OAuth app settings match exactly: `http://localhost:3000/api/auth/callback/google` or `/github`
- No trailing slashes

### Database connection errors
- Run `DATABASE_URL="file:./dev.db" npx prisma db push` to recreate the database
- Check that `prisma/dev.db` exists

## Security Notes

- 🔒 Never commit `.env.local` to version control
- 🔒 Use strong, randomly generated secrets (already configured)
- 🔒 In production, use environment-specific URLs and secrets
- 🔒 Enable HTTPS in production

## Next Steps

Consider adding:
- Email/password authentication
- User roles and permissions
- OAuth provider customization
- Profile editing functionality
- Account deletion and data export (GDPR)
