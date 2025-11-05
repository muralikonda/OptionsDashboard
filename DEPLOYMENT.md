# Deployment Guide

## Option 1: Deploy to Vercel (Recommended - Easiest & Free)

Vercel is the best platform for Next.js apps and provides a free tier with automatic HTTPS and custom domains.

### Method A: Deploy via GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   # Create a new repository on GitHub (github.com)
   # Then run these commands:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and configure everything
   - Click "Deploy"
   - Your app will be live at `https://your-project-name.vercel.app`

### Method B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Your app will be live instantly!

### Method C: Deploy via Vercel Dashboard (Drag & Drop)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login
3. Click "Add New Project"
4. Choose "Upload" or drag your project folder
5. Vercel will build and deploy automatically

## Option 2: Deploy to Netlify (Alternative - Also Free)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

   Or connect to GitHub and use Netlify's dashboard for automatic deployments.

## Option 3: Deploy to Railway (Alternative)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect and deploy

## Sharing Your Dashboard

Once deployed, you'll get a public URL like:
- `https://your-project.vercel.app` (Vercel)
- `https://your-project.netlify.app` (Netlify)
- `https://your-project.up.railway.app` (Railway)

**Share this URL with your friend!** The link will be publicly accessible.

## Important Notes

- All three platforms offer free tiers perfect for personal projects
- Automatic HTTPS is included
- Automatic deployments on git push (if connected to GitHub)
- Custom domains can be added for free

## Troubleshooting

If you encounter build errors:
1. Make sure all dependencies are in `package.json`
2. Run `npm run build` locally first to catch errors
3. Check the build logs in your deployment platform

