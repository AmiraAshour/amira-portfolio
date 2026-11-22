v# Amira Ashour – Premium Personal Developer Portfolio

A modern, responsive, high-performance personal developer portfolio built with **Angular 21** and **Tailwind CSS**, designed specifically for **Amira Ashour** (Full Stack Developer specializing in .NET & Angular).

---

## 🎨 Visual Identity & Design

- **Theme Direction:** Premium dark aesthetic by default, with comprehensive light mode support.
- **Palette (Dark):**
  - Main Background: `#0B100E`
  - Secondary Background: `#111A15`
  - Card Background: `#151E19`
  - Primary Accent: `#C7F36B` (Acid Lime / Electric Chartreuse)
  - Main Text: `#F2F5ED`
  - Secondary Text: `#9AA69C`
  - Borders: `#26342B`
- **Palette (Light):** Carefully harmonized light theme (`#F5F7F2` background, `#1A2E1C` text, `#5A7A10` deep olive accent, `#D0DBC8` subtle borders).
- **Theme Persistence:** Stores user preference in `localStorage` with fallback to `prefers-color-scheme` and flash-prevention script on initial page load.

---

## 🏗️ Website Architecture & Sections

1. **Sticky Navigation Bar:**
   - Monogram logo (`AA`) & typography wordmark
   - Active scroll-spy section links (Home, About, Skills, Projects, Experience, Achievements, Contact)
   - Real-time Theme Toggle (Dark / Light)
   - Verified GitHub & LinkedIn links
   - Download CV button
   - Fully accessible mobile drawer menu
2. **Hero Section:**
   - High-impact headline: *"Building reliable software, one solution at a time."*
   - Clear professional positioning: Full Stack Developer | .NET & Angular
   - Status badge: *"Available for professional opportunities"*
   - Animated engineering visual accents & interactive CTAs
3. **About Me:**
   - Real portrait asset integrated
   - B.IT from Minia University (June 2026, GPA 3.3, Excellent)
   - Highlight cards for client delivery, competitive programming, and continuous learning
   - Core value proposition checklist
4. **Technical Skills:**
   - 5 structured engineering categories: Backend (.NET, C#, MVC, EF Core, SignalR, Hangfire), Frontend (Angular, TypeScript, Tailwind), Databases (SQL Server, Redis, etc.), Architecture (Clean Architecture, SOLID, Repository, Unit of Work), and Tools/DevOps (Docker, Git, Swagger, etc.)
   - Interactive category switching tab system & full overview grid
5. **Featured Projects:**
   - **Laundry Management System:** Real client freelance project actively in production (Hangfire background jobs, WhatsApp invoice delivery, bilingual localization).
   - **Smart Microbus – Wasla:** 6-member graduation platform. Individual backend contributions transparently demarcated (SignalR hubs, location broadcasting, MemoryCache caching, OSRM consumption).
   - **Store API – E-commerce:** Clean Architecture backend with 45+ endpoints, Redis caching, Stripe integration (100+ transactions), and Soundex search.
   - **ConnectFlow:** ASP.NET Core MVC management system with 50+ xUnit tests.
   - **Task Manager – Angular 18:** Standalone components, Angular Signals, lazy loading, and custom route guards.
   - Category filtering (Freelance, Graduation, Personal) & interactive expandable details drawer.
6. **Professional Experience & Education:**
   - Freelance timeline card highlighting real client software delivery
   - Minia University degree timeline
   - ITI 60-hour Web Development using .NET training with direct certificate verification link
   - Udemy specialized coursework
7. **Achievements & Competitive Programming:**
   - ECPC Finalist (with direct certificate link)
   - Codeforces Specialist rank (with verified profile link)
   - First Place – Minia Camp Phase One
8. **Contact & Footer:**
   - Direct mailto link (`amira3shour74@gmail.com`), verified LinkedIn, and GitHub
   - Copyright notice & clean semantic footer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation & Local Development
```bash
# Navigate to the portfolio folder
cd amira-portfolio

# Start the local development server
npm start
# or: npx ng serve
```
Open your browser at `http://localhost:4200` to view the website.

### Production Build
```bash
npm run build
# or: npx ng build
```
The optimized production bundle will be generated in `dist/amira-portfolio/browser/`.

---

## 🔍 SEO & Google Search Console Submission Guide

The portfolio is pre-configured with complete SEO and Structured Data:
- **Semantic HTML5** with accessible headings and ARIA attributes
- **Open Graph & Twitter Cards** for preview cards on social networks and messaging apps
- **JSON-LD Schema.org** markup for a `Person` and `Software Developer` profile
- Pre-generated `robots.txt` and `sitemap.xml` in the `public/` directory

### Steps to Submit to Google Search Console Once Deployed:

1. **Deploy the Site:**
   Deploy the contents of `dist/amira-portfolio/browser` to any hosting provider (e.g., GitHub Pages, Vercel, Netlify, Cloudflare Pages, or Firebase Hosting).
2. **Add Property in Google Search Console:**
   - Go to [Google Search Console](https://search.google.com/search-console).
   - Click **Add Property** and enter your production domain (e.g., `https://amiraashour.dev`).
   - Verify ownership via DNS TXT record or HTML tag/file.
3. **Submit Sitemap:**
   - Go to the **Sitemaps** section in the left sidebar.
   - Enter `sitemap.xml` and click **Submit**.
4. **Request Indexing:**
   - Use the **URL Inspection** tool at the top to inspect `https://amiraashour.dev`.
   - Click **Request Indexing** to prioritize Googlebot crawling.
