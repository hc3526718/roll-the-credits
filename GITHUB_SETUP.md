# GitHub Setup Instructions

## Quick Setup with Personal Access Token

Since we're in a Cloud Agent environment, follow these steps to push your code to GitHub:

### Step 1: Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Set **Note**: "Roll the Credits Deployment"
3. Set **Expiration**: 90 days (or your preference)
4. Select scopes:
   - ✅ **repo** (all repo permissions)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Push Code Using Token

Once you have your token, run these commands in your **Desktop terminal** (not here):

```bash
# Clone the Origin repo to your local machine
git clone https://origin.cursor.com/git/haydn-campbell/tmp-6afe29845dccc3d2.git roll-the-credits
cd roll-the-credits

# Add GitHub remote
git remote add github https://github.com/hc3526718/roll-the-credits.git

# Push to GitHub (will prompt for credentials)
git push github main
# Username: hc3526718
# Password: [paste your token here]
```

**OR use token in URL directly:**

```bash
git push https://YOUR_TOKEN@github.com/hc3526718/roll-the-credits.git main
```

---

## Alternative: Direct Vercel Deployment (No GitHub Needed)

If you want to skip GitHub for now:

### Option A: Vercel CLI (Recommended)

```bash
# On your Desktop/local machine:
cd C:\Users\haydn

# Clone from Origin
git clone https://origin.cursor.com/git/haydn-campbell/tmp-6afe29845dccc3d2.git roll-the-credits
cd roll-the-credits

# Install Vercel CLI globally
npm install -g vercel

# Login and deploy
vercel login
vercel --prod
```

### Option B: Vercel Dashboard Upload

1. Download this repo as ZIP from Origin
2. Go to https://vercel.com/new
3. Click "Deploy" → "Upload"
4. Drag the folder
5. Vercel auto-detects Next.js and deploys

---

## Files Ready for Deployment

✅ **Source Code:**
- All React components (8 screens)
- Game logic and data models
- TypeScript types
- CSS styles

✅ **Configuration:**
- `package.json` - Dependencies
- `next.config.ts` - Next.js config
- `tsconfig.json` - TypeScript config
- `vercel.json` - Vercel build settings
- `tailwind.config.js` - Styles config

✅ **Assets:**
- SVG icons in `/public`
- Favicon

✅ **Documentation:**
- README.md - Game guide
- DEPLOYMENT.md - This guide

---

## Verify GitHub Push

After pushing, verify at:
https://github.com/hc3526718/roll-the-credits

You should see:
- ✅ 35+ files
- ✅ README with game description
- ✅ All components/ and lib/ folders
- ✅ package.json with dependencies

---

## Next: Deploy to Vercel

Once code is on GitHub:

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `hc3526718/roll-the-credits`
4. Framework Preset: **Next.js** (auto-detected)
5. Root Directory: `./` (leave as is)
6. Click **Deploy**

⏱️ Build takes ~2 minutes

🎉 You'll get a URL like: `https://roll-the-credits.vercel.app`

---

## Troubleshooting

**Push fails with authentication error:**
- Make sure token has `repo` scope
- Use token as password when prompted
- Or use token in URL: `https://TOKEN@github.com/...`

**Vercel build fails:**
- Check build logs in Vercel dashboard
- All our tests passed locally, so it should work!

**Need help:**
- All code is committed and tested ✓
- Build verified locally ✓
- Just need to push to GitHub → Vercel will handle the rest!
