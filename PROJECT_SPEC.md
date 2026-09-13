# Crystal Clean Service — Project Specification

## Project
- Name: Crystal Clean Service
- Type: Full-stack corporate company website
- Hosting: cPanel + Terminal/SSH
- Database: MySQL
- Framework: Next.js (latest stable version compatible with deployment requirements)
- Development: Cursor AI Agent
- Reference: https://gcncbd.com/

The reference website is for inspiration only. Do not copy its design, content, branding, images, layout, or code.

## Objectives
Build a unique, professional, attractive, modern, SEO-friendly, mobile-friendly, secure and fast company website with a professional admin dashboard.

Priorities:
1. Security
2. Correctness
3. Stability
4. Performance
5. Maintainability
6. SEO
7. Accessibility
8. UX
9. Visual polish

## Public Pages
- Home
- About Us
- Services
- Individual Service Pages
- Our Concern
- Gallery (Images + YouTube Videos)
- Blog
- Blog Categories
- Blog Details
- Contact Us
- FAQ
- Terms & Conditions
- Privacy Policy

## Home Sections
- Professional navbar
- Hero slider: image, heading, subheading, text, CTA
- Our Services
- Featured Services
- Statistics / animated counters
- Popular Services
- Join With Us CTA
- Testimonials
- Gallery preview
- Video preview
- Our Concern / Crystal Force
- Latest Blogs
- Client logos
- Professional footer

## About Us
- Company introduction
- Mission
- Vision
- Message from Proprietor
- Our Concern
- Why Choose Us

## Services
Services are dynamic and each service has its own SEO-friendly detail page.
Possible fields:
- Name
- Slug
- Icon
- Featured image
- Short description
- Full description
- Features/benefits
- Display order
- Featured/popular status
- Active/inactive
- SEO metadata

## Our Concern
Crystal Force is the security provider concern/company.
Create a professional dynamic concern page with introduction, branding, information, services/features and CTA.

## Gallery
### Images
- Upload
- Title
- Alt text
- Description when useful
- Ordering
- Active/inactive

### Videos
- YouTube URL
- Title
- Thumbnail when needed
- Description
- Ordering
- Active/inactive

Do not download/store YouTube videos unnecessarily.

## Blog
Dynamic SEO-friendly blog system:
- Categories
- Posts
- Slugs
- Featured image
- Excerpt
- Rich-text content
- Author
- Publish date
- Draft/published
- Featured status
- Tags where needed
- SEO title
- Meta description
- OG image
- Canonical URL where needed

Use a practical rich-text editor. Avoid unnecessary complexity.

## Contact
Contact form:
- Name
- Email
- Phone
- Subject
- Message

Store submissions in MySQL and send them to the configured business email through SMTP.

Use:
- Client validation
- Server validation
- Proper success/error states
- Abuse protection/rate limiting where appropriate
- Secure SMTP environment variables

## FAQ
Dynamic question/answer CRUD with ordering and active/inactive status.
Use FAQ structured data where appropriate.

## Branding
Admin-managed:
- Main logo
- Alternate logo if required
- Footer logo if required
- Favicon

## SEO
Dynamic:
- Global SEO settings
- Page SEO
- Blog SEO
- Open Graph
- Canonicals
- Sitemap
- robots.txt
- Semantic headings
- Alt text
- Structured data where appropriate

## Social / WhatsApp
Admin-managed social links:
- Facebook
- Instagram
- YouTube
- LinkedIn
- TikTok
- WhatsApp

Display only configured links.

Add a non-intrusive WhatsApp floating button to the client frontend.

## Admin Dashboard
Professional responsive dashboard with:
- Dashboard
- Website Settings
- Homepage
- Hero Slides
- Services
- Statistics
- Testimonials
- Clients
- Gallery Images
- Gallery Videos
- Blog Categories
- Blog Posts
- FAQ
- Contact Messages
- SEO
- Our Concern
- Legal Pages
- Account/Profile

Only build modules actually needed.

## Database
Use MySQL. Design only the schema required by the real features.
Potential models:
- Admin/User
- SiteSettings
- HeroSlide
- Service
- Statistic
- Testimonial
- Client
- GalleryImage
- GalleryVideo
- BlogCategory
- BlogPost
- FAQ
- ContactMessage
- SocialLink
- SEO/PageMetadata
- LegalPage
- ConcernContent

Do not create unnecessary tables or fields.

## Technical Requirements
- TypeScript
- Next.js App Router
- Server Components where appropriate
- Minimal client components
- Reusable components
- Strong typing
- Secure server-side operations
- Proper validation
- Optimized images
- No unnecessary dependencies
- cPanel-compatible production build
- No hardcoded secrets or localhost production URLs

## Development Phases

### Phase 1 — Client Frontend
Build the complete public frontend with mock/static data.
No database/backend/auth/SMTP integration.

### Phase 1B — Admin Dashboard Frontend
Build the complete dashboard UI with mock/static data.
No database/backend integration.

### Phase 2 — Backend & Database
MySQL, ORM/data layer, schema, migrations, server-side business logic and required APIs/actions.

### Phase 3 — Authentication & Authorization
Secure admin authentication, sessions/cookies, protected routes and authorization.

### Phase 4 — CMS CRUD
Connect dashboard CRUD to MySQL for all required content modules.

### Phase 5 — Dynamic Client Integration
Replace frontend mock data with database-driven content.

### Phase 6 — Blog & SEO
Complete dynamic SEO, blog system, metadata, sitemap, robots and structured data.

### Phase 7 — Contact & SMTP
Complete contact storage, SMTP delivery, business email template and abuse protection.

### Phase 8 — Security, Performance & Final QA
Audit security, performance, responsiveness, accessibility, SEO, build and deployment readiness.

## Phase Rule
Never start the next phase automatically.
At the end of the requested phase:
- Verify
- Update TASK_STATE.md
- Report concise status
- STOP
