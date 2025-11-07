# Setup Guide

## Prerequisites

You need Node.js installed to run this project. If you don't have it:

1. Download Node.js from https://nodejs.org/ (LTS version recommended)
2. Install it
3. Restart your terminal/IDE
4. Verify installation: `node --version` and `npm --version`

## Step 1: Install Dependencies

Once Node.js is installed, run:

```bash
npm install
```

## Step 2: Resume PDF

✅ You've already placed `resume.pdf` in the `public/` folder - great!

## Step 3: Domain URLs (Only for Production)

The files that need domain updates:
- `public/sitemap.xml` - Replace `https://your-domain.com` with your actual domain
- `public/robots.txt` - Same replacement
- `lib/seo.config.ts` - Same replacement

**For local development:** You can skip this step entirely. These are only used when the site is live.

## Running Locally

Once dependencies are installed:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:a11y` - Run accessibility tests



