# Washermann — Marketing Website

The public-facing landing page for **Washermann**, a B2B laundry benefit platform that connects companies, employees, and vetted local service providers (washermen) through a single managed app.

---

## What Washermann Does

Companies subscribe to Washermann and allocate a monthly laundry credit budget per employee — like a meal allowance, but for laundry. Employees schedule pickups via the mobile app, a vetted local washerman collects, cleans, and returns their clothes, and payment is handled automatically from the employee's benefit balance. HR teams get full visibility and budget controls.

**Four roles on the platform:**

| Role | What they do |
|------|-------------|
| **Employee** | Orders via app, tracks in real time, pays from benefit balance |
| **Washerman** | Fulfils orders, manages earnings |
| **Company** | Sets budgets, invites staff, views utilisation reports |
| **Admin** | Full platform oversight |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-based `@theme` config) |
| Animation | Framer Motion 12 |
| Font (display) | Bueno (local `.woff2`) |
| Font (body) | DM Sans (Google Fonts) |
| Images | `next/image` |
| Icons | `lucide-react` + inline SVGs |

---

## Project Structure

```
src/
├── app/
│   ├── globals.css        # Tailwind @theme — brand tokens, keyframes, utilities
│   ├── layout.tsx         # Root layout — fonts, MenuProvider, metadata
│   ├── page.tsx           # Page composition — imports and orders all sections
│   └── icon.png           # Favicon (auto-detected by Next.js App Router)
│
├── components/
│   ├── Navbar.tsx         # Fixed top nav, mega menu overlay, mobile menu
│   ├── PageWrapper.tsx    # Slides page left when mega menu opens
│   ├── Hero.tsx           # Full-screen hero with animated headline
│   ├── HowItWorks.tsx     # Two-panel section: headline + 3-step carousel
│   ├── Features.tsx       # Four product features — arch cards, animated in/out
│   ├── Experiences.tsx    # One platform, four experiences — rotated cards
│   ├── SocialProof.tsx    # Testimonial fan carousel — 9 cards, 3 groups
│   ├── Stats.tsx          # Animated count-up stats, 2 at a time
│   ├── FAQ.tsx            # Accordion FAQ with ghost headline
│   ├── FinalCTA.tsx       # Interactive CTA — arch fills based on user type
│   └── Footer.tsx         # Logo, nav links, WhatsApp QR panel
│
└── context/
    └── menu-context.tsx   # Shared megaOpen state between Navbar and PageWrapper
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## Design System

All brand tokens live in `src/app/globals.css` inside a Tailwind v4 `@theme` block. Do **not** use `tailwind.config.ts` — it is not used in this project.

### Colours

| Token | Hex | Usage |
|-------|-----|-------|
| `wm-green` | `#08523C` | Primary brand green — backgrounds, text |
| `wm-mint` | `#3BF4BE` | Accent — CTAs, headlines on green |
| `wm-pink` | `#DB3C8A` | Highlight — hero pill, feature cards |
| `wm-mint-light` | `#D4F5EC` | Light tint |
| `wm-blush` | `#F5D0DA` | Stats section background |

### Typography

| Token | Font | Usage |
|-------|------|-------|
| `font-display` | Bueno (local) | All large headlines, ghost watermarks, numbers |
| `font-body` | DM Sans | Body copy, labels, UI text |

Ghost watermarks use `text-white/[0.06]` or `text-white/[0.07]` on green backgrounds, and `text-gray-100` on white backgrounds.

### Animations

| Name | Purpose |
|------|---------|
| `marquee` / `marquee2` | Continuous horizontal scroll strips |
| `blob` | Organic shape morphing |
| `float` | Gentle vertical float |

---

## Public Assets

Place these files in the `/public` directory:

```
public/
├── logo.png                  # Square icon logo (used in Navbar)
├── footer-logo.png           # Wordmark logo (used in Footer)
├── whatsapp-qr.png           # WhatsApp QR code (Navbar mega menu + Footer)
├── fonts/
│   └── Bueno.woff2           # Display font — required
├── icons/
│   ├── employee.svg
│   ├── washerman.svg
│   ├── company.svg
│   └── admin.svg
└── testimonials/
    ├── 1.jpg  through  9.jpg # Testimonial photos (SocialProof section)
```

> **Note:** `testimonials/1.jpg` through `9.jpg` are required for the SocialProof section. They should be portrait-oriented photos, ideally showing real people or teams.

---

## Key Component Notes

### Navbar
- Mega menu shares state via `MenuContext` — Navbar sets `megaOpen`, PageWrapper reads it to slide the page left simultaneously.
- Hide-on-scroll behaviour is suspended while the mega menu is open.

### Features
- Two animation hooks run in parallel: `useVerticalStack` (mobile) and `useHorizontalArrange` (desktop).
- Cards spring up from centre (`x: 0vw, y: 110%`) to their final spread positions using `FINAL_X_PCT = [-36, -12, 12, 36]`.

### SocialProof
- 9 testimonials split into 3 groups of 3. Phases: `building` → `holding` → `waiting` → next group.
- Each card slides in from a right-side tray and fans into position. Build delay is 2.6 s per card to allow reading time.

### Stats
- Count-up uses `requestAnimationFrame` + `performance.now()` with an ease-out cubic curve.
- Two pairs cycle automatically: `[2,400+ & 94%]` → `[3HRS & 4.9★]`.

### FinalCTA
- Three arch states: **initial** (empty) → **select** (Company / Employee picker) → **content** (4 variations based on intent × user type).
- `intent = "start"` → brief steps + prominent CTAs. `intent = "how"` → detailed steps + smaller CTAs.

---

## Browser Extension Warning

If you see a React hydration mismatch in the console mentioning `data-gr-ext-installed`, this is caused by the **Grammarly** browser extension injecting attributes into `<body>`. It is suppressed via `suppressHydrationWarning` on the `<body>` tag and does not affect functionality.

---

## Deployment

This is a standard Next.js app. Deploy to any platform that supports Node.js:

- **Vercel** (recommended) — zero config, connect repo and push to deploy
- **Netlify** — set build command to `npm run build`, publish directory to `.next`
- **Self-hosted** — `npm run build && npm start`
