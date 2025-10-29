# Admin Panel Guide

## Accessing the Admin Panel

1. Go to: `http://localhost:3000/admin`
2. Enter your admin password (set in `.env.local` as `ADMIN_PASSWORD`)
3. Default: You need to add `ADMIN_PASSWORD=your-password` to `.env.local`

## Admin Panel Features

### 1. **Resume Content** (`/admin/resume`)
- Edit all resume information
- Add/remove experience entries
- Add/remove education entries
- Update skills
- All changes save immediately to `content/resume.json`

### 2. **Campaigns** (`/admin/campaigns`)
- View all campaigns
- Add new campaigns (click "Add New Campaign" button)
- Edit existing campaigns
- Delete campaigns
- Format:
  - Title
  - Description
  - Results (one per line)
  - Date (use date picker)
  - Link (optional)

### 3. **Social Links** (`/admin/social`)
- Update all social media profile URLs
- Supported platforms: Instagram, Facebook, Twitter/X, LinkedIn, GitHub, Reddit, CoinMarketCap, Threads
- Leave empty if you don't have a profile

### 4. **File Upload** (`/admin/upload`)
- Upload PDF files
- Upload Word documents (.doc, .docx)
- Upload images (PNG, JPG, JPEG)
- View all uploaded files
- Delete files
- **Important**: Upload a file named `resume.pdf` to replace auto-generated PDF

## Setting Admin Password

1. Create `.env.local` file in the root directory (if it doesn't exist)
2. Add: `ADMIN_PASSWORD=your-secure-password`
3. Restart the dev server: `npm run dev`

## How Content Updates Work

When you update content in the admin panel:
1. Changes are saved immediately to JSON files in `/content` directory
2. The main website reads from these JSON files
3. Refresh the main website to see changes

## File Storage

- Uploaded files are stored in `public/uploads/` directory
- Access uploaded files at: `http://localhost:3000/uploads/filename.pdf`
- If you upload `resume.pdf`, the download button will use it instead of generating PDF

## Quick Reference

**Where content is stored:**
- Resume: `content/resume.json`
- Campaigns: `content/campaigns.json`
- Social Links: `content/social-links.json`
- Uploaded Files: `public/uploads/`

**Admin Routes:**
- Login: `/admin`
- Dashboard: `/admin/dashboard`
- Edit Resume: `/admin/resume`
- Edit Campaigns: `/admin/campaigns`
- Edit Social Links: `/admin/social`
- Upload Files: `/admin/upload`

