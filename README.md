# মসজিদ চাঁদা ম্যানেজমেন্ট — Vercel Deployment

## Vercel-এ Deploy করার পদ্ধতি

### ধাপ ১: GitHub-এ Push করুন
এই `vercel-deploy` ফোল্ডারটি আলাদা GitHub repository হিসেবে push করুন:

```bash
cd vercel-deploy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mosjid-chanda.git
git push -u origin main
```

### ধাপ ২: Vercel-এ Import করুন
1. [vercel.com](https://vercel.com) এ লগইন করুন
2. "Add New Project" বাটনে ক্লিক করুন
3. আপনার GitHub repo select করুন
4. Build settings:
   - **Framework**: Vite
   - **Root Directory**: `.` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. "Deploy" বাটনে ক্লিক করুন

### অ্যাডমিন পাসওয়ার্ড
- পাসওয়ার্ড: `admin123`
- `/admin/login` পেজে লগইন করুন

## স্থানীয়ভাবে চালানোর পদ্ধতি

```bash
cd vercel-deploy
npm install
npm run dev
```
