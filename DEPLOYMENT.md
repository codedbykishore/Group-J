# 🚀 Deploying to Vercel

This guide walks you through deploying your M&A Due Diligence Chat application to Vercel.

## Prerequisites

- A GitHub account (your repo: `codedbykishore/Group-J`)
- A Vercel account (free tier works fine)
- Your Contextual AI API credentials

## Step-by-Step Deployment

### 1. Commit and Push Your Code

First, ensure all changes are committed and pushed to GitHub:

```bash
cd /home/kinux/projects/Group-J

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "feat: implement Contextual AI chat integration"

# Push to GitHub
git push origin main
```

### 2. Connect to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find and select `codedbykishore/Group-J`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** Click "Edit" and set to `frontend`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install --legacy-peer-deps`

4. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   
   | Name | Value | Environment |
   |------|-------|-------------|
   | `CONTEXTUAL_API_KEY` | `key-uRyfZgT-9AkHMBigRnrc7cUO0QN3m3w_HZ2gPUTDx5TP7O-5w` | Production, Preview, Development |
   | `AGENT_ID` | `5d4f0493-bdb5-4bd9-bd28-23dacef6fd6d` | Production, Preview, Development |

   ⚠️ **Security Note:** These are server-side variables and won't be exposed to the browser.

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd /home/kinux/projects/Group-J/frontend

# Login to Vercel
vercel login

# Deploy (first time)
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name: group-j-chat (or your choice)
# - Directory: ./ (current directory is frontend)
# - Override settings? No

# Set environment variables
vercel env add CONTEXTUAL_API_KEY production
# Paste: key-uRyfZgT-9AkHMBigRnrc7cUO0QN3m3w_HZ2gPUTDx5TP7O-5w

vercel env add AGENT_ID production
# Paste: 5d4f0493-bdb5-4bd9-bd28-23dacef6fd6d

# Redeploy with environment variables
vercel --prod
```

### 3. Update Build Configuration (if needed)

If you encounter peer dependency issues during Vercel build, create `frontend/.npmrc`:

```bash
cd /home/kinux/projects/Group-J/frontend
echo "legacy-peer-deps=true" > .npmrc
git add .npmrc
git commit -m "chore: add .npmrc for Vercel build"
git push origin main
```

This ensures Vercel uses `--legacy-peer-deps` during installation.

### 4. Verify Deployment

Once deployed:

1. **Test the Homepage**
   - Visit your Vercel URL (e.g., `https://group-j-chat.vercel.app`)
   - You should see the document management dashboard

2. **Test the Chat**
   - Click "Enquire" in the sidebar
   - Send a test message: "What was Seagen's total revenue in 2022?"
   - Verify you get a response from the Contextual AI agent

3. **Check API Route**
   ```bash
   curl -X POST https://your-project.vercel.app/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Test query"}'
   ```

### 5. Configure Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

## Environment Variables Reference

Your app needs these environment variables on Vercel:

```env
CONTEXTUAL_API_KEY=key-uRyfZgT-9AkHMBigRnrc7cUO0QN3m3w_HZ2gPUTDx5TP7O-5w
AGENT_ID=5d4f0493-bdb5-4bd9-bd28-23dacef6fd6d
```

⚠️ **Never commit these values to your repository!** They're already in `.gitignore`.

## Troubleshooting

### Build Fails with Peer Dependency Error

**Solution:** Add `.npmrc` file (see Step 3 above)

### API Returns 500 Error

**Cause:** Missing environment variables

**Solution:** 
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify both `CONTEXTUAL_API_KEY` and `AGENT_ID` are set
3. Redeploy: Deployments → Click "..." → Redeploy

### Chat Doesn't Respond

**Check:**
1. Browser Console (F12) for errors
2. Vercel Function Logs: Dashboard → Your Project → Logs
3. Verify API route is accessible: `https://your-project.vercel.app/api/chat`

### TypeScript Errors During Build

**Solution:** TypeScript config is already set up correctly. If you see errors:
1. Check the Vercel build logs
2. Run `npm run build` locally first to catch issues
3. Fix any type errors in your code

## Continuous Deployment

Vercel automatically redeploys when you push to `main`:

```bash
# Make changes
git add .
git commit -m "your message"
git push origin main

# Vercel will automatically:
# 1. Detect the push
# 2. Build your app
# 3. Deploy to production
```

## Project Structure for Vercel

```
Group-J/
├── frontend/              ← Root directory for Vercel
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts  ← API endpoint
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── chatbot.tsx
│   ├── .env.local         ← Local only (in .gitignore)
│   ├── .npmrc             ← Build configuration
│   ├── next.config.mjs
│   ├── package.json
│   └── tsconfig.json
├── .env                   ← Local only (in .gitignore)
├── Agentic_RAG.ipynb
└── README.md
```

## Security Best Practices

✅ **DO:**
- Use Vercel's environment variables dashboard
- Keep API keys in `.env.local` locally (never commit)
- Use server-side API routes for sensitive operations
- Rotate API keys regularly

❌ **DON'T:**
- Commit `.env` or `.env.local` to Git
- Use `NEXT_PUBLIC_` prefix for API keys
- Expose credentials in client-side code
- Share your Vercel deployment URL with API keys visible

## Support & Resources

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation:** [nextjs.org/docs](https://nextjs.org/docs)
- **Contextual AI Docs:** [docs.contextual.ai](https://docs.contextual.ai)

## Quick Deploy Button (for future use)

After first deployment, you can add this to your README:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/codedbykishore/Group-J&project-name=group-j-chat&root-directory=frontend&env=CONTEXTUAL_API_KEY,AGENT_ID)
```

---

**Your app is now live on Vercel! 🎉**

Visit your deployment URL and start chatting with your M&A Due Diligence agent.
