# Deploy to Vercel

## Quick Setup

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? (your account)
- Link to existing project? **N**
- Project name? **greenline-saas** (or your choice)
- In which directory is your code located? **./**
- Want to override settings? **N**

4. **Set Environment Variables in Vercel Dashboard**

Go to your project in Vercel → Settings → Environment Variables and add:

```
GOOGLE_CLIENT_ID=<your-client-id-from-.env>
GOOGLE_CLIENT_SECRET=<your-client-secret-from-.env>
GOOGLE_REDIRECT_URI=https://your-vercel-url.vercel.app/auth/google/callback
VITE_API_URL=https://your-vercel-url.vercel.app
```

Copy the values from `apps/api/.env` file (don't commit secrets to GitHub!)

5. **Update Google Cloud Console**

- Go to Google Cloud Console → APIs & Services → Credentials
- Edit your OAuth 2.0 Client ID
- Add Authorized Redirect URI: `https://your-vercel-url.vercel.app/auth/google/callback`
- Save

6. **Redeploy**
```bash
vercel --prod
```

## Why Vercel is Better for Testing

✅ No local server management issues
✅ Both API and frontend in one deployment
✅ Automatic HTTPS (required for Google OAuth in production)
✅ Environment variables managed in dashboard
✅ Easy to share links for testing
✅ Free tier is generous

## Alternative: Test Locally with Better Setup

If you prefer local testing, we can set up:
1. **Concurrently** to run both servers in one terminal
2. **nodemon** with better configuration
3. Separate terminal windows that don't interfere

Let me know which you prefer!
