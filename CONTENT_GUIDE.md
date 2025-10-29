# Content Management Guide

## 📁 Where to Update Content

All content files are located in the `/content` directory. Here's where to update each type of content:

### 1. **Resume Information** 📄
**File:** `content/resume.json`

Update your personal information, experience, education, and skills here.

### 2. **Campaign Details** 📊
**File:** `content/campaigns.json`

Add or update your marketing campaigns and their results.

**To add a new campaign:**
1. Open `content/campaigns.json`
2. Add a new object with a unique `id`
3. Save the file
4. Refresh your browser

### 3. **Social Media Links** 🔗
**File:** `content/social-links.json`

Update all your social media profile links here. Leave any field empty if you don't have that profile.

### 4. **Resume PDF Upload** 📑
To upload a resume PDF instead of generating it:

1. Place your resume PDF in the `public/` folder
2. Name it `resume.pdf`
3. The download button will automatically use it

## 🔄 After Making Changes

1. Save the JSON file
2. Refresh your browser
3. Changes will appear immediately

