# Push Code to GitHub - Step by Step

## Option 1: Using Personal Access Token (Easiest)

### Step 1: Create a Personal Access Token

1. Go to GitHub: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `OptionsDashboard Push`
4. Select scopes: Check **`repo`** (this gives full repository access)
5. Click **"Generate token"**
6. **COPY THE TOKEN** - You won't see it again!

### Step 2: Push Using Token

When you run `git push`, use:
- **Username**: Your GitHub username (`muralikonda`)
- **Password**: Paste the token you just created

Run this command:
```bash
git push -u origin main
```

Enter your credentials when prompted.

---

## Option 2: Using GitHub CLI (Alternative)

### Install GitHub CLI:
```bash
brew install gh
```

### Authenticate:
```bash
gh auth login
```
Follow the prompts to authenticate with GitHub.

### Then push:
```bash
git push -u origin main
```

---

## Option 3: Use SSH (If you have SSH keys set up)

### Change remote to SSH:
```bash
git remote set-url origin git@github.com:muralikonda/OptionsDashboard.git
```

### Then push:
```bash
git push -u origin main
```

---

## Quick Command (Use Option 1)

After creating your token, just run:
```bash
git push -u origin main
```

When asked for password, paste your token (not your GitHub password).

---

**Once pushed, you can deploy to Vercel by connecting your GitHub repo!**

