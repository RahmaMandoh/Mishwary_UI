# Mishwary — Interactive Landing Page Prototype

An interactive, responsive HTML/CSS/JS prototype of the **Mishwary** ride-hailing landing page, built from the Figma design (`Landing Pages` → `Mishwary`, sections M1–M8).

## What's interactive
- Sticky navigation with active-section highlighting and smooth scrolling
- Mobile hamburger menu
- Scroll-reveal animations for headings, cards and images
- Hero phones that tilt with the mouse (parallax) and float
- Floating feature chips around the "Smart Mobility Platform" phones
- Cards with a purple spotlight that follows the cursor
- "Journey" steps that auto-cycle and highlight on hover/click
- "Get Started" / "Contact Us" modal with a validated form (prototype only — nothing is sent)
- Fully responsive (desktop → tablet → phone) and respects `prefers-reduced-motion`

## Run locally
No build step. Open `index.html` directly, or serve the folder:

```bash
python -m http.server 5173
```

Then visit http://localhost:5173.

## Structure
```
index.html        page markup (sections M1–M8)
styles.css        design tokens + layout + responsive rules
script.js         interactions
assets/img/       phone / tablet mockups exported from Figma (WebP)
assets/icons/     feature icons (SVG)
```

## Deploy on GitHub Pages
Repository → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
