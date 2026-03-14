# Project Context & Future Roadmap

This document serves as a memory bank and context provider for future AI chat sessions or manual development. Provide this file to your AI assistant when starting a new session to immediately bring them up to speed on the project's current state and technical decisions.

## 📌 Current State (As of March 2026)
- The website is a fully self-contained static site (HTML, CSS, JS).
- It is successfully deployed to **GitHub Pages** from the root of the `main` branch.
- **Recent Fixes:** 
  - Moved core files (`index.html`, `styles.css`, `script.js`) from a nested `Code/` folder into the root directory so GitHub Pages could detect and build the site without throwing a 404 error.
  - Renamed all image files in the `Media/` folder to replace spaces with underscores (e.g., `Social_events_Picture.jpg`), ensuring web compatibility and preventing broken image links during deployment.

## 🎯 Next Steps / Future Improvements

### 1. Better Image Organization
Currently, all images are stored flat inside the `Media/` folder. As the portfolio grows, this can become difficult to manage.
**Goal:** Organize media into subdirectories based on event types while ensuring the filtering logic in `script.js` still functions perfectly.
*Proposed Structure:*
- `Media/Corporate/`
- `Media/Weddings/`
- `Media/General/`

### 2. Gallery Optimization & Dynamic Loading
- Implementing **Image Compression:** Current files vary heavily in size (up to 14MB). We should process and compress these images into next-gen formats (.webp) for significantly faster loading times.
- Implementing lazy loading or a JSON-based dynamic gallery generator so you don't have to manually update `index.html` every time you add a new photo.

### 3. Feature Additions
*Waiting on user requirements for specific new features (e.g., functioning contact backend, CMS integration, or new UI sections).*

## ⚠️ Important Technical Notes for AI
- **Paths:** Always use relative paths securely linking back to the root (e.g., `Media/image_name.jpg`). Do not use absolute local machine paths.
- **Styles:** The project uses Vanilla CSS without a framework. Maintain the existing design system variables (gold text `.gold-text`, dark backgrounds) found in `styles.css`.
- **Browser Caching:** When testing changes on the live GitHub Pages URL, remind the user about browser caching. Changes may require a Hard Refresh (Cmd+Shift+R) or testing in an Incognito window to bypass cached redirects/assets.
