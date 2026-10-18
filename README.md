# Tova — Frontend

React + Vite front end for Tova, built to match the FAQs and Features screenshots.

## Run it

```bash
npm install
cp .env.example .env.local   # points VITE_API_URL at your Django API
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173). For the waitlist
form and FAQ page to actually work, the Django backend needs to be running too (see
the backend's own README) — `VITE_API_URL` defaults to `http://localhost:8000/api`.

To build for production:

```bash
npm run build
```

## Backend wiring

- **"Join the Waitlist"** buttons (header, Home hero, About) all open a shared modal
  (`src/components/WaitlistModal.jsx`) that posts to `POST /api/waitlist/`. It's opened
  via a small context (`src/context/WaitlistModalContext.jsx`) so any button on any
  page can trigger it without prop-drilling.
- **FAQs page** fetches the FAQ list from `GET /api/faqs/` on load. If the API isn't
  reachable (backend not running, wrong URL, etc.) it silently falls back to a static
  list baked into `Faqs.jsx`, so the page never looks broken during frontend-only dev.
- The **"ask a question"** box posts to `POST /api/faqs/ask/` and shows a real
  success/error state based on the response.
- All API calls go through `src/api/client.js` — one place to change the base URL,
  error handling, or add auth headers later.

## Pages

- `/` — Home. No screenshot was provided for this one, so it's built using the same
  design system (colors, type, header, footer) pulled from the FAQs/Features images.
- `/about` — About. Same situation as Home — same design system, placeholder copy.
- `/faqs` — Matches the FAQs screenshot closely (hero, "ask a question" box, email
  fallback), plus a real FAQ accordion added underneath, populated from the backend
  (falls back to a static list if the API isn't running). The ask box is fully wired
  up to the backend.
- `/features` — Left as a "coming soon" stub for now, as requested. The nav link
  already points to it, so it's ready for you to build out later.

## Swapping in your real assets

**Logo:** `src/components/Logo.jsx` is currently a placeholder mark (a "T", a circle
badge, "va"). Once you have your logo file:

1. Drop it into `src/assets/` (e.g. `src/assets/logo.png` or `.svg`).
2. In `Logo.jsx`, replace the placeholder markup with:
   ```jsx
   import logoImg from "../assets/logo.png";
   <img src={logoImg} alt="Tova" className={`logo logo--${size}`} />
   ```
3. You can delete `Logo.css` once you no longer need the placeholder styling (or keep
   it if you want to control the rendered size via the `logo--md` / `logo--lg` classes).

**Phone mockup:** `src/components/PhoneMockup.jsx` renders a placeholder phone frame
with a gradient screen. Once you have the real app screenshot:

```jsx
import screenshot from "../assets/app-screenshot.png";
<PhoneMockup screenshot={screenshot} />
```

It's currently used on the Home page hero (`src/pages/Home.jsx`).

## Design tokens

All colors, fonts, and spacing live in `src/styles/global.css` as CSS variables
(`--color-navy`, `--font-display`, etc.) so the whole site stays consistent as you
build out more pages. Fonts used: Fraunces (headlines), Inter (body/nav), Caveat
(the "One platform. One body." script line) — loaded via Google Fonts in
`index.html`.

## Structure

```
src/
  api/          client.js — fetch wrapper for waitlist + FAQ endpoints
  context/      WaitlistModalContext.jsx — lets any button open the waitlist modal
  components/   Header, Footer, Logo, PhoneMockup, Accordion, BrandSignature,
                CrossWatermark, WaitlistModal
  pages/        Home, About, Features, Faqs
  styles/       global.css (design tokens + base styles)
```

Mobile is handled with a hamburger nav in the header and stacked/responsive layouts
on every page — resize down to test, or check it in dev tools' device toolbar.
