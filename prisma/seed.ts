// Phase 2 seed — fills MySQL with Phase 1 demo content. Idempotent: re-runs
// upsert on unique keys (slug, page path, kind, key) without duplicating rows.

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  console.log("→ Seeding Crystal Clean Service…");

  // -- Site settings (single row) --
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      brandName:       "Crystal Clean Service",
      tagline:         "Professional cleaning for spaces that need to feel trusted.",
      email:           "hello@example.com",
      phone:           "+880 0000-000000",
      address:         "Demo address — replace via the admin dashboard",
      mainLogo:        "/brand/crystal-clean-logo.jpg",
      footerLogo:      "/brand/crystal-clean-logo.jpg",
      favicon:         "/favicon.jpg",
      mainLogoHeight:   32,
      footerLogoHeight: 40,
    },
    create: {
      id: 1,
      brandName:       "Crystal Clean Service",
      tagline:         "Professional cleaning for spaces that need to feel trusted.",
      email:           "hello@example.com",
      phone:           "+880 0000-000000",
      address:         "Demo address — replace via the admin dashboard",
      mainLogo:        "/brand/crystal-clean-logo.jpg",
      footerLogo:      "/brand/crystal-clean-logo.jpg",
      favicon:         "/favicon.jpg",
      mainLogoHeight:   32,
      footerLogoHeight: 40,
    },
  });

  // -- SEO settings (single row) --
  await prisma.seoSettings.upsert({
    where: { id: 1 },
    update: {
      siteTitle:          "Crystal Clean Service | Professional Cleaning",
      defaultDescription: "Professional cleaning for spaces that need to feel trusted.",
      ogImageLabel:       "og-default.jpg (demo)",
      twitterHandle:      "@crystalclean_demo",
      robotsIndex:        true,
      canonicalBase:      "https://example.com",
    },
    create: {
      id: 1,
      siteTitle:          "Crystal Clean Service | Professional Cleaning",
      defaultDescription: "Professional cleaning for spaces that need to feel trusted.",
      ogImageLabel:       "og-default.jpg (demo)",
      twitterHandle:      "@crystalclean_demo",
      robotsIndex:        true,
      canonicalBase:      "https://example.com",
    },
  });

  // -- Homepage sections --
  const homepageSections = [
    { key: "hero", name: "Hero slider", order: 1 },
    { key: "services", name: "Our Services", order: 2 },
    { key: "featured", name: "Featured Services", order: 3 },
    { key: "stats", name: "Statistics", order: 4 },
    { key: "popular", name: "Popular Services", order: 5 },
    { key: "join", name: "Join With Us CTA", order: 6 },
    { key: "testimonials", name: "Testimonials", order: 7 },
    { key: "gallery", name: "Gallery preview", order: 8 },
    { key: "video", name: "Video preview", order: 9 },
    { key: "concern", name: "Our Concern", order: 10 },
    { key: "blog", name: "Latest Blogs", order: 11 },
    { key: "clients", name: "Client logos", order: 12 },
  ];
  for (const s of homepageSections) {
    await prisma.homepageSection.upsert({
      where: { key: s.key },
      update: { name: s.name, order: s.order, enabled: true },
      create: { ...s, enabled: true },
    });
  }

  // -- Hero slides --
  const heroSlides = [
    { image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=2000&q=80", imageAlt: "Professional cleaning team preparing a bright interior space", heading: "Spaces that feel freshly reset", subheading: "Commercial & residential cleaning", text: "Crystal Clean Service delivers disciplined, detail-focused cleaning for offices, homes, and shared environments.", ctaLabel: "Explore services", ctaHref: "/services", order: 1 },
    { image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=2000&q=80", imageAlt: "Clean modern office corridor after professional service", heading: "Reliability you can schedule around", subheading: "Consistent teams. Clear standards.", text: "From daily maintenance to deep cleans, every visit follows a clear checklist and quality review.", ctaLabel: "Request a visit", ctaHref: "/contact", order: 2 },
    { image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=2000&q=80", imageAlt: "Sparkling glass surface reflecting natural light", heading: "Clarity in every surface", subheading: "Premium finish cleaning", text: "Glass, floors, and high-touch zones treated with care so your space looks intentional — not just tidy.", ctaLabel: "View gallery", ctaHref: "/gallery", order: 3 },
  ];
  // Wipe and re-insert by order
  await prisma.heroSlide.deleteMany({});
  for (const s of heroSlides) {
    await prisma.heroSlide.create({ data: { ...s, active: true } });
  }

  // -- Services --
  const services = [
    { name: "Office Cleaning", slug: "office-cleaning", category: "Commercial", icon: "building" as const, featuredImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", imageAlt: "Bright open-plan office ready for cleaning service", shortDescription: "Scheduled cleaning for workplaces that need a consistent professional standard.", fullDescription: "Looking for dependable office cleaning? Crystal Clean Service provides trained teams for workplaces that need a steady professional standard. We cover desks, floors, restrooms, pantries, and shared zones with a repeatable checklist so daily operations stay undisturbed.", workScope: ["Desk and workstation wipe-down","Floor sweeping and mopping","Restroom and pantry hygiene","Dusting of reachable surfaces","Trash and recycling removal","Lift lobby and corridor care","Meeting room reset","Entrance and reception presentation"], outcomes: ["A clearer, more presentable workplace for staff and visitors","Predictable routines your operations team can plan around"], features: ["Daily or weekly schedules","Restroom and pantry hygiene","Dust and floor care","After-hours options"], packageTags: ["Office Cleaning","Commercial Cleaning","Daily Maintenance","Workplace Hygiene"], availability: "Demo availability: weekday and after-hours slots. Exact scheduling will be confirmed through the contact form once live booking is connected.", rating: 4.8, reviewCount: 3, featured: true, popular: true, order: 1 },
    { name: "Home Cleaning", slug: "home-cleaning", category: "Residential", icon: "home" as const, featuredImage: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1200&q=80", imageAlt: "Bright residential living space", shortDescription: "Thorough residential cleaning that respects your home and your time.", fullDescription: "Home cleaning visits focus on kitchens, bathrooms, living areas, and bedrooms with careful attention to surfaces your family uses every day. Choose one-time refreshes or recurring plans as demo options while CMS scheduling is prepared.", workScope: ["Kitchen counters and appliance exteriors","Bathroom fixtures and floors","Living area dusting and floors","Bedroom surface care","Entryway tidy-up","Accessible window glass wipe"], outcomes: ["A home that feels reset without overnight disruption","Flexible timing that fits family schedules"], features: ["Kitchen and bathroom focus","Floor and surface care","Flexible visit timing","Recurring plan options"], packageTags: ["Home Cleaning","Residential Cleaning","Recurring Care","Apartment Cleaning"], availability: "Demo availability: mornings and weekends. Final visit windows will be set during booking.", rating: 4.6, reviewCount: 2, featured: true, popular: true, order: 2 },
    { name: "Deep Cleaning", slug: "deep-cleaning", category: "Specialty", icon: "spark" as const, featuredImage: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=1200&q=80", imageAlt: "Detailed cleaning supplies arranged neatly", shortDescription: "Intensive resets for spaces that need more than routine maintenance.", fullDescription: "Deep cleaning restores a cleaner baseline when soil has built up beyond routine visits. Ideal for move-ins, seasonal resets, and neglected zones that need detailed attention before regular maintenance continues.", workScope: ["Detail work in corners and edges","Fixture and cabinet exterior attention","Hard-to-reach dust zones","Kitchen and bathroom intensive reset","Floor edge and baseboard care","Before/after walkthrough notes"], outcomes: ["A stronger starting point for ongoing cleaning","Clear documentation of completed detail zones"], features: ["Detail-oriented checklists","Hard-to-reach zones","Seasonal and move-in resets","Before/after walkthrough notes"], packageTags: ["Deep Cleaning","Move-in Reset","Seasonal Clean","Detail Cleaning"], availability: "Demo availability: booked by appointment for longer visit windows.", rating: 5, reviewCount: 2, featured: true, popular: false, order: 3 },
    { name: "Window Cleaning", slug: "window-cleaning", category: "Glass Care", icon: "window" as const, featuredImage: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80", imageAlt: "Large window with clear glass in daylight", shortDescription: "Clear glass and frames for brighter interiors and sharper exteriors.", fullDescription: "Window cleaning covers glass, frames, and accessible exterior panes so interiors feel brighter and façades look sharper. Built for offices and homes that want a streak-conscious finish.", workScope: ["Interior glass cleaning","Accessible exterior panes","Frame and sill wipe-down","Partition glass where reachable","Entrance glass presentation"], outcomes: ["Clearer natural light indoors","A cleaner first impression at entrances"], features: ["Interior and accessible exterior glass","Frame wipe-down","Streak-conscious finish","Scheduled maintenance options"], packageTags: ["Window Cleaning","Glass Cleaning","Façade Care","Office Glass"], availability: "Demo availability: weather-dependent exterior access; interiors can be scheduled year-round.", rating: 4.7, reviewCount: 2, featured: true, popular: true, order: 4 },
    { name: "Carpet Care", slug: "carpet-care", category: "Floor Care", icon: "carpet" as const, featuredImage: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1200&q=80", imageAlt: "Clean carpeted hallway in a professional building", shortDescription: "Carpet refreshing that improves appearance and everyday comfort.", fullDescription: "Carpet care focuses on soil removal and surface revival for high-traffic areas. Useful after events, seasonal wear, or as part of a larger facility refresh.", workScope: ["High-traffic lane attention","Spot treatment where needed","Surface revival passes","Edge and transition care"], outcomes: ["Fresher carpet appearance in busy zones","Better pairing with full facility refreshes"], features: ["High-traffic zone focus","Appearance revival","Spot attention","Facility refresh pairing"], packageTags: ["Carpet Care","Floor Refresh","Facility Cleaning","Event Recovery"], availability: "Demo availability: scheduled around drying time and facility access.", rating: 4.5, reviewCount: 2, featured: false, popular: false, order: 5 },
    { name: "Sanitization", slug: "sanitization", category: "Hygiene", icon: "sanitize" as const, featuredImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80", imageAlt: "Clean restroom and hygiene-focused interior", shortDescription: "High-touch surface attention for healthier shared environments.", fullDescription: "Sanitization visits prioritize handles, switches, restrooms, and shared contact points. Available as an add-on or standalone hygiene-focused service for offices and public-facing spaces.", workScope: ["Door handles and push plates","Light switches and shared controls","Restroom touchpoints","Reception counter wipe-down","Shared desk peripherals where requested"], outcomes: ["More intentional hygiene coverage in shared spaces","Easy pairing with regular cleaning schedules"], features: ["High-touch surface focus","Restroom hygiene emphasis","Shared-space routines","Add-on or standalone visits"], packageTags: ["Sanitization","High-touch Hygiene","Workplace Care","Restroom Focus"], availability: "Demo availability: can be booked alone or paired with routine cleaning visits.", rating: 4.5, reviewCount: 2, featured: false, popular: true, order: 6 },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { ...s, active: true },
      create: { ...s, active: true },
    });
  }

  // -- Service reviews --
  const reviews = [
    { serviceSlug: "office-cleaning", name: "Rafi Ahmed", rating: 5, comment: "Our desks, pantry, and restrooms look consistently maintained. The team follows a clear checklist every visit.", createdAt: new Date("2026-07-02") },
    { serviceSlug: "office-cleaning", name: "Sabrina Chowdhury", rating: 5, comment: "After-hours cleaning works well for our floor. Communication is prompt and the finish is professional.", createdAt: new Date("2026-06-18") },
    { serviceSlug: "office-cleaning", name: "Imran Kabir", rating: 4, comment: "Solid weekly service. Floors and meeting rooms stay presentable for client visits.", createdAt: new Date("2026-05-30") },
    { serviceSlug: "home-cleaning", name: "Farzana Akter", rating: 5, comment: "Kitchen and bathrooms were carefully handled. The house felt reset without anything being rushed.", createdAt: new Date("2026-07-10") },
    { serviceSlug: "home-cleaning", name: "Tanvir Hasan", rating: 4, comment: "Reliable recurring visits. Good attention to living areas and entryway presentation.", createdAt: new Date("2026-06-05") },
    { serviceSlug: "deep-cleaning", name: "Laila Noor", rating: 5, comment: "Move-in deep clean was thorough — corners, fixtures, and floors looked newly prepared.", createdAt: new Date("2026-06-22") },
    { serviceSlug: "deep-cleaning", name: "Mahmud Reza", rating: 5, comment: "Seasonal reset made a clear difference. Detail work matched what we asked for.", createdAt: new Date("2026-04-14") },
    { serviceSlug: "window-cleaning", name: "Priya Sultana", rating: 5, comment: "Office glass looks sharp and bright. Frames were wiped carefully too.", createdAt: new Date("2026-07-01") },
    { serviceSlug: "window-cleaning", name: "Omar Faruk", rating: 4, comment: "Entrance and partition glass improved a lot. Scheduling was flexible.", createdAt: new Date("2026-05-12") },
    { serviceSlug: "carpet-care", name: "Nusrat Jahan", rating: 5, comment: "High-traffic lanes look fresher after the carpet refresh. Useful after our event week.", createdAt: new Date("2026-06-28") },
    { serviceSlug: "carpet-care", name: "Shahriar Alam", rating: 4, comment: "Noticeable improvement on lobby carpet. Drying time was managed as promised.", createdAt: new Date("2026-03-20") },
    { serviceSlug: "sanitization", name: "Mehnaz Begum", rating: 5, comment: "High-touch zones and restrooms get focused attention. Easy to pair with our regular clean.", createdAt: new Date("2026-07-08") },
    { serviceSlug: "sanitization", name: "Arif Hossain", rating: 4, comment: "Useful hygiene add-on for shared desks and reception. Team was careful and efficient.", createdAt: new Date("2026-05-03") },
  ];
  await prisma.serviceReview.deleteMany({});
  for (const r of reviews) {
    await prisma.serviceReview.create({ data: { ...r, approved: true } });
  }

  // -- Statistics --
  const stats = [
    { label: "Projects completed", value: 480, suffix: "+", order: 1 },
    { label: "Active clients",     value: 120, suffix: "+", order: 2 },
    { label: "Trained staff",      value:  65, suffix: "+", order: 3 },
    { label: "Years of care",      value:   8, suffix: "+", order: 4 },
  ];
  await prisma.statistic.deleteMany({});
  for (const s of stats) {
    await prisma.statistic.create({ data: { ...s, active: true } });
  }

  // -- Testimonials --
  const testimonials = [
    { name: "Ayesha Rahman",  role: "Operations lead (demo)", quote: "The team arrived on schedule and left our floors and shared areas looking intentionally maintained — not rushed.", avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80", avatarAlt: "Portrait of Ayesha Rahman",  order: 1 },
    { name: "Karim Hossain",  role: "Facility manager (demo)", quote: "Communication was clear, the checklist was followed, and follow-ups were easy. Exactly what we needed for weekly office care.", avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", avatarAlt: "Portrait of Karim Hossain",  order: 2 },
    { name: "Nadia Islam",    role: "Homeowner (demo)",        quote: "Deep cleaning before we moved in made the house feel ready. Detail work in kitchens and bathrooms stood out.", avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80", avatarAlt: "Portrait of Nadia Islam",    order: 3 },
    { name: "Rezaul Karim",   role: "Clinic administrator (demo)", quote: "Sanitization add-ons and restroom standards give our staff more confidence in shared spaces every week.", avatarSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80", avatarAlt: "Portrait of Rezaul Karim",   order: 4 },
    { name: "Sumaiya Kabir",  role: "Retail supervisor (demo)", quote: "Window and floor presentation improved our front-of-house look. Guests notice the difference immediately.", avatarSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80", avatarAlt: "Portrait of Sumaiya Kabir",  order: 5 },
    { name: "Fahim Rahman",   role: "Property coordinator (demo)", quote: "Reliable schedules and tidy handovers. Our lobbies stay ready for viewings without last-minute scrambling.", avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", avatarAlt: "Portrait of Fahim Rahman",   order: 6 },
  ];
  await prisma.testimonial.deleteMany({});
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: { ...t, active: true } });
  }

  // -- Clients --
  const clients = [
    { name: "Northbridge Offices",     logoSrc: "/clients/northbridge.svg", logoAlt: "Northbridge Offices logo",     order: 1 },
    { name: "Harborline Residences",   logoSrc: "/clients/harborline.svg",  logoAlt: "Harborline Residences logo",   order: 2 },
    { name: "Summit Clinic Group",     logoSrc: "/clients/summit.svg",      logoAlt: "Summit Clinic Group logo",     order: 3 },
    { name: "Lumen Retail Co.",        logoSrc: "/clients/lumen.svg",       logoAlt: "Lumen Retail Co. logo",        order: 4 },
    { name: "Cedar Park School",       logoSrc: "/clients/cedar-park.svg",  logoAlt: "Cedar Park School logo",       order: 5 },
    { name: "Atlas Logistics",         logoSrc: "/clients/atlas.svg",       logoAlt: "Atlas Logistics logo",         order: 6 },
  ];
  await prisma.client.deleteMany({});
  for (const c of clients) {
    await prisma.client.create({ data: { ...c, active: true } });
  }

  // -- Gallery images --
  const galleryImages = [
    { title: "Office floor finish",     alt: "Polished office corridor after cleaning",  description: "Routine commercial corridor care", src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80", order: 1 },
    { title: "Residential kitchen reset", alt: "Bright kitchen with clean counters",   description: "Kitchen surface and appliance exterior care", src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=80", order: 2 },
    { title: "Glass clarity",           alt: "Large clean windows in a modern room",    description: "Interior glass and frame attention", src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80", order: 3 },
    { title: "Washroom standard",       alt: "Clean modern bathroom interior",          description: "Restroom hygiene and presentation", src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1000&q=80", order: 4 },
    { title: "Lobby presentation",      alt: "Hotel-style lobby seating area",          description: "Front-of-house area refresh", src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80", order: 5 },
    { title: "Team in action",          alt: "Cleaning professional working indoors",   description: "On-site professional service", src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80", order: 6 },
    { title: "Open-plan workspace",     alt: "Bright open office with desks and natural light", description: "Workstation and floor maintenance", src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80", order: 7 },
    { title: "Living room refresh",     alt: "Neat residential living room after cleaning", description: "Residential surface and floor care", src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80", order: 8 },
    { title: "Meeting room reset",      alt: "Conference room with clean table and chairs", description: "Meeting room presentation standards", src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80", order: 9 },
    { title: "Detail supplies ready",   alt: "Organized cleaning supplies on a cart",   description: "Prepared kits for detail cleaning visits", src: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=1000&q=80", order: 10 },
    { title: "Carpeted corridor",       alt: "Clean carpeted hallway in an office building", description: "Carpet care for high-traffic lanes", src: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1000&q=80", order: 11 },
    { title: "Reception counter",       alt: "Modern reception desk in a bright lobby", description: "Front desk and entry presentation", src: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1000&q=80", order: 12 },
  ];
  await prisma.galleryImage.deleteMany({});
  for (const g of galleryImages) {
    await prisma.galleryImage.create({ data: { ...g, active: true } });
  }

  // -- Gallery videos --
  const galleryVideos = [
    { title: "Facility walkthrough sample",     description: "A demo walkthrough of finished commercial interiors after a scheduled clean.", youtubeId: "aqz-KE-bpKQ", order: 1 },
    { title: "Cleaning process overview",       description: "Placeholder overview of how teams move through floors, restrooms, and shared zones.", youtubeId: "ScMzIvxBSi4", order: 2 },
    { title: "Office reset highlights",         description: "Demo clip showing desks, glass, and lobby presentation after a maintenance visit.", youtubeId: "M7lc1UVf-VE", order: 3 },
    { title: "Home deep-clean moments",         description: "Sample footage for kitchen, bathroom, and living-area reset storytelling.", youtubeId: "LXb3EKWsInQ", order: 4 },
  ];
  await prisma.galleryVideo.deleteMany({});
  for (const v of galleryVideos) {
    await prisma.galleryVideo.create({ data: { ...v, active: true } });
  }

  // -- Blog categories --
  const blogCategories = [
    { name: "Cleaning Tips",  slug: "cleaning-tips",  description: "Practical guidance for everyday upkeep." },
    { name: "Workplace Care", slug: "workplace-care", description: "Ideas for healthier, more presentable offices." },
    { name: "Company Notes",  slug: "company-notes",  description: "Updates and service insights from Crystal Clean Service." },
  ];
  for (const c of blogCategories) {
    await prisma.blogCategory.upsert({
      where: { slug: c.slug }, update: c, create: c,
    });
  }

  // -- Blog posts --
  const blogPosts = [
    { title: "How to keep high-touch office zones under control", slug: "high-touch-office-zones", excerpt: "A practical routine for handles, switches, and shared desks that keeps workplaces feeling cared for between deep cleans.", content: "High-touch surfaces collect soil quickly in busy offices. A short daily routine focused on doors, switches, shared desks, and pantry handles can reduce visible wear between full cleaning visits.\n\nPairing this with a weekly restroom and floor standard keeps the space looking intentional. This article is demo content for Phase 1 and will be managed through the CMS later.\n\nConsistency matters more than complexity. Clear checklists help teams finish the right tasks every visit.", featuredImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80", imageAlt: "Modern office desks near large windows", author: "Crystal Clean Editorial", publishedAt: new Date("2026-06-12"), categorySlug: "workplace-care", featured: true, tags: ["office","hygiene","routines"] },
    { title: "Deep cleaning vs routine cleaning: when each makes sense", slug: "deep-vs-routine-cleaning", excerpt: "Understand the difference between maintenance visits and intensive resets so you book the right service for your space.", content: "Routine cleaning maintains a baseline. Deep cleaning restores that baseline when soil has built up in corners, fixtures, and less-visible zones.\n\nMove-ins, seasonal changes, and post-event recovery are common reasons to schedule a deeper visit. Demo article for layout and SEO structure testing.\n\nAfter a deep clean, a recurring plan helps protect the investment and keep results consistent.", featuredImage: "https://images.unsplash.com/photo-1581579188871-c99b0c7315b1?auto=format&fit=crop&w=1200&q=80", imageAlt: "Cleaning tools and cloth arranged for deep cleaning", author: "Crystal Clean Editorial", publishedAt: new Date("2026-05-28"), categorySlug: "cleaning-tips", featured: true, tags: ["deep cleaning","planning"] },
    { title: "What a professional cleaning checklist usually covers", slug: "professional-cleaning-checklist", excerpt: "A transparent look at the zones and standards professional teams typically follow on commercial visits.", content: "A useful checklist separates floors, surfaces, restrooms, glass, and waste. Each zone has a finish standard so quality can be reviewed quickly.\n\nClients benefit when expectations are written down. This demo post shows how Crystal Clean Service will present educational content once the blog CMS is connected.\n\nReviewing the checklist with your provider keeps priorities aligned as seasons and occupancy change.", featuredImage: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a71?auto=format&fit=crop&w=1200&q=80", imageAlt: "Checklist and cleaning preparation on a table", author: "Crystal Clean Editorial", publishedAt: new Date("2026-04-18"), categorySlug: "company-notes", featured: false, tags: ["standards","checklist"] },
    { title: "Five habits that keep restrooms guest-ready", slug: "restroom-guest-ready-habits", excerpt: "Simple restroom habits that protect presentation between full cleaning visits in offices and public spaces.", content: "Restrooms shape how visitors judge a building. Stock checks, mirror clarity, and floor dryness matter as much as deep sanitization cycles.\n\nA short midday touch-up paired with a stronger evening clean keeps most facilities looking intentional. Demo guidance for Phase 1 content layout.\n\nDocumenting who owns each habit prevents gaps when occupancy spikes.", featuredImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80", imageAlt: "Clean modern restroom interior", author: "Crystal Clean Editorial", publishedAt: new Date("2026-03-22"), categorySlug: "workplace-care", featured: true, tags: ["restrooms","hygiene"] },
    { title: "How often should office carpets be refreshed?", slug: "office-carpet-refresh-frequency", excerpt: "A practical guide to carpet care timing for lobbies, corridors, and open-plan floors.", content: "Traffic patterns decide carpet schedules more than calendar dates. Lobbies and main corridors usually need more frequent attention than low-use rooms.\n\nPair appearance refreshes with event recovery or seasonal resets so soil does not set into fibers. Demo article for blog listing density.\n\nAsk your provider for a simple traffic map when building an annual plan.", featuredImage: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1200&q=80", imageAlt: "Carpeted office hallway after cleaning", author: "Crystal Clean Editorial", publishedAt: new Date("2026-02-14"), categorySlug: "cleaning-tips", featured: false, tags: ["carpet","floors"] },
    { title: "Preparing your space before a first cleaning visit", slug: "prepare-for-first-cleaning-visit", excerpt: "A short prep list that helps teams work efficiently on the first visit and deliver a clearer finish.", content: "Clearing floors, securing valuables, and noting priority rooms helps a first visit go smoothly. Access instructions for lifts and storage also save time.\n\nShare any product sensitivities or restricted zones before arrival. This demo post models how company notes will appear in the live CMS.\n\nA quick walkthrough at the end of the visit locks in expectations for the recurring plan.", featuredImage: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1200&q=80", imageAlt: "Bright residential interior ready for cleaning", author: "Crystal Clean Editorial", publishedAt: new Date("2026-01-30"), categorySlug: "company-notes", featured: false, tags: ["onboarding","planning"] },
  ];
  for (const p of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: { ...p, published: true },
      create: { ...p, published: true },
    });
  }

  // -- FAQ --
  const faqs = [
    { question: "Which areas do you clean?", answer: "Demo answer: offices, homes, and selected commercial interiors including lobbies, restrooms, kitchens, and shared workspaces. Exact coverage will be managed in the CMS.", order: 1 },
    { question: "Can we schedule recurring visits?", answer: "Yes — daily, weekly, and custom recurring plans are part of the intended service model. Booking details will be finalized with live business settings later.", order: 2 },
    { question: "Do you bring your own supplies?", answer: "Demo answer: teams typically arrive prepared with standard cleaning materials. Specific product preferences or supply arrangements can be confirmed during booking.", order: 3 },
    { question: "How do I request a quote?", answer: "Use the Contact page form with your space type, preferred schedule, and any priority zones. In Phase 1 the form is a front-end demo only and does not send email or store messages yet.", order: 4 },
    { question: "What is Crystal Force?", answer: "Crystal Force is presented as the security-provider concern of Crystal Clean Service. See the Our Concern page for the demo overview.", order: 5 },
    { question: "Do you offer after-hours cleaning?", answer: "Demo answer: after-hours and early-morning slots are available for many commercial sites so daytime operations stay uninterrupted.", order: 6 },
    { question: "Can deep cleaning be booked as a one-time service?", answer: "Yes. Deep cleaning is commonly booked for move-ins, seasonal resets, or post-event recovery, then followed by a lighter recurring plan.", order: 7 },
    { question: "How are quality standards checked?", answer: "Demo answer: visits follow zone checklists with a finish standard for floors, restrooms, glass, and high-touch surfaces. A short walkthrough can be arranged when needed.", order: 8 },
  ];
  await prisma.faqItem.deleteMany({});
  for (const f of faqs) {
    await prisma.faqItem.create({ data: { ...f, active: true } });
  }

  // -- Social links --
  const social = [
    { platform: "facebook",  label: "Facebook",  href: "https://facebook.com",                    order: 1 },
    { platform: "instagram", label: "Instagram", href: "https://instagram.com",                   order: 2 },
    { platform: "youtube",   label: "YouTube",   href: "https://youtube.com",                     order: 3 },
    { platform: "whatsapp",  label: "WhatsApp",  href: "https://wa.me/8800000000000",             order: 4 },
  ] as const;
  await prisma.socialLink.deleteMany({});
  for (const s of social) {
    await prisma.socialLink.create({
      data: { platform: s.platform, label: s.label, href: s.href, order: s.order, active: true },
    });
  }

  // -- About content (single row) --
  await prisma.aboutContent.upsert({
    where: { id: 1 },
    update: {
      introduction:      "Crystal Clean Service is a professional cleaning company focused on dependable standards for workplaces and homes. This About page uses demo copy for Phase 1 and will later be managed from the admin CMS.",
      mission:           "Deliver consistent, respectful cleaning that helps spaces feel clear, healthy, and ready for people.",
      vision:            "Become a trusted cleaning partner known for reliability, care, and quiet professionalism.",
      proprietorMessage: "Clean spaces support focus and confidence. Our goal is simple: show up prepared, follow a clear standard, and leave every site better than we found it. — Proprietor (demo message)",
      teamImage:         "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80",
      teamImageAlt:      "Professional team collaborating in a bright office",
      workspaceImage:    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
      workspaceImageAlt: "Clean modern office workspace",
      contactImage:      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
      contactImageAlt:   "Bright commercial corridor representing Crystal Clean Service sites",
      values: [
        { title: "Reliability", description: "Teams arrive prepared and follow agreed schedules so operations stay predictable." },
        { title: "Care",        description: "Surfaces, belongings, and shared zones are handled with calm attention to detail." },
        { title: "Clarity",     description: "Checklists and simple communication keep expectations visible for every visit." },
      ],
      whyChooseUs: [
        "Checklist-driven service quality",
        "Respectful teams and clear communication",
        "Flexible commercial and residential options",
        "Attention to presentation, not only task completion",
        "Reliable scheduling for busy workplaces and homes",
        "Hygiene-focused options for high-touch shared spaces",
      ],
    },
    create: {
      id: 1,
      introduction:      "Crystal Clean Service is a professional cleaning company focused on dependable standards for workplaces and homes. This About page uses demo copy for Phase 1 and will later be managed from the admin CMS.",
      mission:           "Deliver consistent, respectful cleaning that helps spaces feel clear, healthy, and ready for people.",
      vision:            "Become a trusted cleaning partner known for reliability, care, and quiet professionalism.",
      proprietorMessage: "Clean spaces support focus and confidence. Our goal is simple: show up prepared, follow a clear standard, and leave every site better than we found it. — Proprietor (demo message)",
      teamImage:         "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80",
      teamImageAlt:      "Professional team collaborating in a bright office",
      workspaceImage:    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
      workspaceImageAlt: "Clean modern office workspace",
      contactImage:      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
      contactImageAlt:   "Bright commercial corridor representing Crystal Clean Service sites",
      values: [
        { title: "Reliability", description: "Teams arrive prepared and follow agreed schedules so operations stay predictable." },
        { title: "Care",        description: "Surfaces, belongings, and shared zones are handled with calm attention to detail." },
        { title: "Clarity",     description: "Checklists and simple communication keep expectations visible for every visit." },
      ],
      whyChooseUs: [
        "Checklist-driven service quality",
        "Respectful teams and clear communication",
        "Flexible commercial and residential options",
        "Attention to presentation, not only task completion",
        "Reliable scheduling for busy workplaces and homes",
        "Hygiene-focused options for high-touch shared spaces",
      ],
    },
  });

  // -- Concern content (single row) --
  await prisma.concernContent.upsert({
    where: { id: 1 },
    update: {
      name:         "Crystal Force",
      tagline:      "Security presence with a disciplined professional standard.",
      introduction: "Crystal Force is the security-provider concern associated with Crystal Clean Service. This page presents a professional overview of the concern's role, values, and service posture using Phase 1 demo content.",
      brandingNote: "Crystal Force focuses on reliable guarding, visitor awareness, and calm on-site presence for facilities that need trusted protection alongside clean, well-kept environments.",
      image:        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
      imageAlt:     "Professional team reviewing facility operations documents",
      ctaLabel:     "Contact Crystal Clean Service",
      ctaHref:      "/contact",
      features: [
        { title: "On-site vigilance",   description: "Trained personnel focused on access awareness and steady site presence." },
        { title: "Clear protocols",     description: "Simple reporting habits and shift routines that keep communication usable." },
        { title: "Facility alignment",  description: "Works alongside cleaning and facility teams so sites feel orderly and secure." },
        { title: "Professional conduct", description: "Uniformed, courteous presentation that supports a trustworthy property image." },
      ],
    },
    create: {
      id: 1,
      name:         "Crystal Force",
      tagline:      "Security presence with a disciplined professional standard.",
      introduction: "Crystal Force is the security-provider concern associated with Crystal Clean Service. This page presents a professional overview of the concern's role, values, and service posture using Phase 1 demo content.",
      brandingNote: "Crystal Force focuses on reliable guarding, visitor awareness, and calm on-site presence for facilities that need trusted protection alongside clean, well-kept environments.",
      image:        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
      imageAlt:     "Professional team reviewing facility operations documents",
      ctaLabel:     "Contact Crystal Clean Service",
      ctaHref:      "/contact",
      features: [
        { title: "On-site vigilance",   description: "Trained personnel focused on access awareness and steady site presence." },
        { title: "Clear protocols",     description: "Simple reporting habits and shift routines that keep communication usable." },
        { title: "Facility alignment",  description: "Works alongside cleaning and facility teams so sites feel orderly and secure." },
        { title: "Professional conduct", description: "Uniformed, courteous presentation that supports a trustworthy property image." },
      ],
    },
  });

  // -- Legal pages (terms + privacy) --
  await prisma.legalPage.upsert({
    where: { kind: "terms" },
    update: {
      title:    "Terms & Conditions",
      updated:  new Date("2026-08-30"),
      sections: [
        { heading: "Demo notice",          body: "This page is sample legal content for Phase 1 layout only. Replace with reviewed legal text before production launch." },
        { heading: "Use of the website",  body: "Visitors may browse public pages for information about Crystal Clean Service. Misuse of forms or automated abuse is not permitted." },
        { heading: "Service information", body: "Service descriptions on this demo site are illustrative. Binding terms for actual cleaning engagements will be provided separately when services are contracted." },
      ],
    },
    create: {
      kind:    "terms",
      title:   "Terms & Conditions",
      updated: new Date("2026-08-30"),
      sections: [
        { heading: "Demo notice",          body: "This page is sample legal content for Phase 1 layout only. Replace with reviewed legal text before production launch." },
        { heading: "Use of the website",  body: "Visitors may browse public pages for information about Crystal Clean Service. Misuse of forms or automated abuse is not permitted." },
        { heading: "Service information", body: "Service descriptions on this demo site are illustrative. Binding terms for actual cleaning engagements will be provided separately when services are contracted." },
      ],
    },
  });
  await prisma.legalPage.upsert({
    where: { kind: "privacy" },
    update: {
      title:    "Privacy Policy",
      updated:  new Date("2026-08-30"),
      sections: [
        { heading: "Demo notice",                       body: "This privacy page is placeholder content for Phase 1. A production policy must reflect real data practices, hosting, and contact handling." },
        { heading: "Information we may collect later",  body: "When the contact system is connected, submissions may include name, email, phone, subject, and message for business follow-up." },
        { heading: "Current Phase 1 behavior",         body: "The contact form currently validates input in the browser only and does not store or email submissions." },
      ],
    },
    create: {
      kind:    "privacy",
      title:   "Privacy Policy",
      updated: new Date("2026-08-30"),
      sections: [
        { heading: "Demo notice",                       body: "This privacy page is placeholder content for Phase 1. A production policy must reflect real data practices, hosting, and contact handling." },
        { heading: "Information we may collect later",  body: "When the contact system is connected, submissions may include name, email, phone, subject, and message for business follow-up." },
        { heading: "Current Phase 1 behavior",         body: "The contact form currently validates input in the browser only and does not store or email submissions." },
      ],
    },
  });

  // -- Contact messages (sample admin messages) --
  const messages = [
    { name: "Rafi Ahmed",          email: "rafi@example.com",    phone: "+880 1700-000001", subject: "Office cleaning quote",      message: "Looking for weekly office cleaning for a 4,000 sq ft floor.", status: "new" as const },
    { name: "Sadia Khan",          email: "sadia@example.com",   phone: "+880 1700-000002", subject: "Deep cleaning before move-in", message: "Need a deep clean for a 3-bedroom apartment next week.",    status: "read" as const },
    { name: "Imran Chowdhury",     email: "imran@example.com",   phone: "+880 1700-000003", subject: "Window cleaning schedule",    message: "Interested in monthly window cleaning for a showroom.",     status: "archived" as const },
  ];
  await prisma.contactMessage.deleteMany({});
  for (const m of messages) {
    await prisma.contactMessage.create({ data: m });
  }

  // -- Admin user --
  // Credentials come from .env so real deployments never ship a known password.
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const adminName = process.env.ADMIN_NAME ?? "Site Owner";
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  const passwordHash =
    adminPassword && adminPassword.length >= 8
      ? await hashPassword(adminPassword)
      : existingAdmin?.passwordHash ?? null;

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { name: adminName, role: "owner", ...(passwordHash ? { passwordHash } : {}) },
    create: { name: adminName, email: adminEmail, role: "owner", passwordHash },
  });

  if (!passwordHash) {
    console.warn(
      "! No ADMIN_PASSWORD set (min 8 chars) — the admin account cannot sign in yet.",
    );
  }

  console.log("✓ Seed complete.");
}

main()
  .catch((err) => {
    console.error("✗ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
