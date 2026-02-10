<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# The Never-Wilt Rose 🌹

A beautiful digital rose with AI-generated love notes for your special someone on Rose Day!

## Quick Start

**Prerequisites:** Node.js 18+

### Local Development

1. **Clone or download the project**

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/)
   - Add your API key to `.env.local`:
     ```
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

---

## 🚀 Netlify Deployment

### Step 1: Prepare Your Repository

```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Step 2: Deploy to Netlify

**Option A: Using Netlify UI (Recommended for first-time)**

1. Go to [netlify.com](https://netlify.com)
2. Click "Add New Site" → "Import an existing project"
3. Select your Git provider (GitHub, GitLab, Bitbucket)
4. Choose your repository
5. Build settings should auto-detect:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy"

**Option B: Using Netlify CLI**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Step 3: Add Environment Variables

1. Go to your Netlify site settings
2. Navigate to **Build & deploy** → **Environment**
3. Click **Edit variables**
4. Add a new variable:
   - **Key:** `VITE_GEMINI_API_KEY`
   - **Value:** Your Gemini API key from [Google AI Studio](https://aistudio.google.com/)
5. Save and redeploy

### Step 4: Redeploy with Secret

After adding the environment variable:

- Go to **Deployments** tab
- Click the **Trigger deploy** button and select **Deploy site**
- Wait for the build to complete ✅

---

## ✨ Features

- 🎨 Beautiful animated UI with Framer Motion
- 💕 AI-generated personalized love notes using Google Gemini
- 🎉 Confetti effects and particle animations
- 📱 Fully responsive design
- 🌐 Works perfectly on mobile and desktop
- 🚀 Optimized for production

---

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Google Gemini AI** - Note generation
- **canvas-confetti** - Celebration effects

---

## 📝 Environment Variables

Create a `.env.local` file:

```
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Get your API key here: [Google AI Studio](https://aistudio.google.com/)

---

## 🔒 Security Notes

- Never commit `.env.local` to version control
- `.env.local` is listed in `.gitignore`
- API keys should only be in Netlify environment variables for production
- The app works only with Gemini AI in browser

---

## Build & Deployment

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📄 License

Made with ❤️ for Rose Day
