#!/bin/bash
set -e

echo "=================================================="
echo "  Roll the Credits - Deployment Setup"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Authenticate with GitHub${NC}"
echo "--------------------------------------"
echo "Running: gh auth login"
echo ""
gh auth login || { echo -e "${YELLOW}Note: You can also authenticate manually at github.com${NC}"; }

echo ""
echo -e "${BLUE}Step 2: Create GitHub Repository${NC}"
echo "--------------------------------------"

if gh auth status >/dev/null 2>&1; then
  echo "Creating repository 'roll-the-credits'..."
  gh repo create roll-the-credits \
    --public \
    --description "A creative studio tycoon game - Game Dev Tycoon + Creator Sims + Storyteller" \
    --source=. \
    --remote=github
  
  echo ""
  echo -e "${GREEN}✓ Repository created!${NC}"
  
  echo ""
  echo -e "${BLUE}Step 3: Push to GitHub${NC}"
  echo "--------------------------------------"
  git push github main
  
  echo ""
  echo -e "${GREEN}✓ Code pushed to GitHub!${NC}"
  
  # Get the repo URL
  REPO_URL=$(gh repo view --json url -q .url)
  
  echo ""
  echo "=================================================="
  echo -e "${GREEN}  SUCCESS!${NC}"
  echo "=================================================="
  echo ""
  echo "Your repository: $REPO_URL"
  echo ""
  echo -e "${BLUE}Next Steps:${NC}"
  echo "1. Go to https://vercel.com"
  echo "2. Click 'Add New Project'"
  echo "3. Import from GitHub: 'roll-the-credits'"
  echo "4. Click 'Deploy' (Vercel auto-detects Next.js)"
  echo ""
  echo "Your game will be live at: https://roll-the-credits.vercel.app"
  echo "(or similar - Vercel will show you the exact URL)"
  echo ""
else
  echo -e "${YELLOW}Manual Setup Required${NC}"
  echo ""
  echo "1. Go to https://github.com/new"
  echo "2. Repository name: roll-the-credits"
  echo "3. Make it Public"
  echo "4. Click 'Create repository'"
  echo ""
  echo "Then run:"
  echo "  git remote add github https://github.com/YOUR_USERNAME/roll-the-credits.git"
  echo "  git push github main"
fi
