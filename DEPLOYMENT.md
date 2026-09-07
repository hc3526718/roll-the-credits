# Deployment Guide for Roll the Credits

## Quick Deploy to Vercel (Easiest Option)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Create GitHub Repository:**
   ```bash
   # In your terminal/desktop, authenticate with GitHub:
   gh auth login
   
   # Create the repository:
   gh repo create roll-the-credits --public --description "A creative studio tycoon game" --source=. --push
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository (`roll-the-credits`)
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

### Option 2: Use Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

## GitHub Repository Setup

If you don't have `gh` CLI, create manually:

1. Go to [github.com/new](https://github.com/new)
2. Name: `roll-the-credits`
3. Description: "A creative studio tycoon game - Game Dev Tycoon + Creator Sims + Storyteller"
4. Make it Public
5. Don't initialize with README (we already have one)
6. Click "Create repository"

Then push your code:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/roll-the-credits.git
git push -u origin main
```

## Environment Variables

No environment variables required! The game runs entirely in the browser with localStorage.

## Vercel Configuration

Already included in the repo:
- ✅ `vercel.json` - Build configuration
- ✅ `next.config.ts` - Next.js settings  
- ✅ `.gitignore` - Proper exclusions
- ✅ Production build tested and passing

## Build Verification

The production build has been tested and works:

```bash
npm run build
# ✓ Compiled successfully
# ✓ TypeScript checks pass
# ✓ Static pages generated
```

## About the WebSocket Error

The WebSocket error you saw:
```
WebSocket connection to 'ws://127.0.0.1:43172/_next/hmr' failed
```

This is **harmless** and **only affects development**:
- It's Next.js Hot Module Reload (HMR) trying to connect
- Happens when the dev server restarts or has connection hiccups
- **Does not affect production** - production builds don't use HMR
- Your game works perfectly despite this warning

You can safely ignore it, or refresh the browser to reconnect.

## Post-Deployment

Once deployed, your game will:
- ✅ Auto-deploy on every push to main
- ✅ Get a `.vercel.app` domain (e.g., `roll-the-credits.vercel.app`)
- ✅ Support custom domains if desired
- ✅ Include automatic HTTPS
- ✅ Serve from edge locations worldwide

## Verifying Deployment

After deploying, test these features:
1. ☐ Start new game
2. ☐ Create a project (concept → hire → scenes → produce → edit → results)
3. ☐ Save/load works (localStorage)
4. ☐ Complete second project
5. ☐ Trends update between projects
6. ☐ Scores and cash persist

## Need Help?

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Issues: Open an issue on your GitHub repo

---

**Current Status:**
- ✅ Code committed and pushed to Origin
- ✅ Production build verified
- ✅ Vercel config ready
- ⏳ Waiting for GitHub repo creation
- ⏳ Waiting for Vercel deployment
