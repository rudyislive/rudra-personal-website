# Rudra's Personal Website

A modern, animated portfolio website built with Next.js, featuring integrated social media feeds from X (Twitter) and LinkedIn.

## Features

- **Animated UI**: Built with Framer Motion for smooth animations
- **Portfolio Showcase**: Display your campaigns and results
- **Resume Section**: Professional resume presentation
- **Social Media Integration**: Automatically pulls posts from X and LinkedIn
- **Responsive Design**: Works beautifully on all devices
- **Dark Mode**: Built-in dark mode support

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- API credentials for Twitter/X and LinkedIn (see API Setup below)

### Installation

1. Clone the repository:
```bash
cd rudras-personal-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API credentials (see API Setup section below).

4. Update your content:
- Edit `content/resume.json` with your resume information
- Edit `content/campaigns.json` with your campaign details

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your website.

## API Setup

### Twitter/X API

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a developer account (if needed)
3. Create a new app/project
4. In the app settings, go to "Keys and Tokens"
5. Generate a Bearer Token (or use API Key/Secret)
6. Add to `.env.local`:
   ```
   TWITTER_USERNAME=your_username (without @)
   TWITTER_BEARER_TOKEN=your_bearer_token
   ```

**Note**: Twitter API v2 is available with a free tier, but has rate limits.

### LinkedIn API

LinkedIn API setup is more complex and requires OAuth 2.0:

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Get your Client ID and Client Secret
4. You'll need to implement OAuth flow to get an Access Token
5. Get your Person ID (your LinkedIn profile ID)
6. Add to `.env.local`:
   ```
   LINKEDIN_ACCESS_TOKEN=your_access_token
   LINKEDIN_PERSON_ID=your_person_id
   ```

**Note**: LinkedIn access tokens expire. You may need to refresh them periodically or use a service that handles OAuth automatically.

### Alternative: Manual Post Updates

If API setup is too complex, you can manually update posts by:
1. Creating a simple admin interface
2. Using RSS feeds (if available)
3. Manually adding posts to a JSON file

## Content Management

### 📁 File Locations

All content is managed through JSON files in the `/content` directory:

1. **Resume**: `content/resume.json` - Your personal info, experience, education, skills
2. **Campaigns**: `content/campaigns.json` - Your marketing campaigns and results
3. **Social Links**: `content/social-links.json` - All your social media profile URLs

### Adding Campaigns

Edit `content/campaigns.json` and add new campaign objects:

```json
{
  "id": "campaign-4",
  "title": "Your Campaign Title",
  "description": "Campaign description",
  "results": [
    "Result 1",
    "Result 2"
  ],
  "date": "2024-01-01",
  "link": "https://example.com"
}
```

### Updating Resume

Edit `content/resume.json` with your information. The structure supports:
- Personal information (name, title, email, phone, location)
- Experience history
- Education
- Skills

### Social Media Links

Edit `content/social-links.json` to add your social media profiles:

```json
{
  "instagram": "https://instagram.com/your-profile",
  "facebook": "https://facebook.com/your-profile",
  "twitter": "https://twitter.com/your-profile",
  "linkedin": "https://linkedin.com/in/your-profile",
  "github": "https://github.com/your-profile",
  "reddit": "https://reddit.com/user/your-profile",
  "coinmarketcap": "https://coinmarketcap.com/community/profile/your-profile",
  "threads": "https://threads.net/@your-profile"
}
```

**Note:** Leave any field empty or remove it if you don't have that profile. Only links you provide will be displayed.

### Resume PDF

**Option 1: Auto-generated PDF (Current)**
- The website automatically generates a PDF when users click "Download Resume"
- No file upload needed
- PDF is created from your resume.json content

**Option 2: Upload Your Own PDF**
1. Place your resume PDF in the `public/` folder
2. Name it `resume.pdf`
3. Open `components/portfolio/Resume.tsx`
4. Find `handleDownloadResume` function and replace it with:
```typescript
const handleDownloadResume = () => {
  window.open('/resume.pdf', '_blank');
};
```

For detailed instructions, see `CONTENT_GUIDE.md` in the root directory.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

Vercel will automatically:
- Detect Next.js
- Build and deploy your site
- Set up HTTPS and CDN

### Vercel Cron Jobs (Optional)

To automatically update social posts daily, create `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/twitter",
    "schedule": "0 0 * * *"
  }]
}
```

## Project Structure

```
rudras-personal-website/
├── app/
│   ├── api/
│   │   ├── twitter/      # Twitter API route
│   │   └── linkedin/     # LinkedIn API route
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── portfolio/       # Portfolio components
│   └── social/           # Social feed components
├── content/              # Content files (JSON)
│   ├── campaigns.json
│   └── resume.json
├── lib/
│   ├── api/              # API client functions
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript types
│   └── utils/             # Utility functions
└── public/               # Static assets
```

## Customization

### Colors and Styling

Edit `app/globals.css` and Tailwind config for custom colors and styling.

### Animations

Modify Framer Motion animations in components for different effects.

### Layout

Update components in `components/` directory to change layout and structure.

## Troubleshooting

### Social posts not showing

1. Check that API credentials are correctly set in `.env.local`
2. Verify API credentials are valid
3. Check browser console for errors
4. Verify API endpoints are accessible

### Build errors

1. Make sure all dependencies are installed: `npm install`
2. Check TypeScript errors: `npm run build`
3. Verify all imports are correct

## License

MIT License - feel free to use this for your own portfolio!

## Support

For issues or questions, please open an issue on GitHub.
