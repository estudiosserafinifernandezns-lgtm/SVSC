# Project memory

## Product intent & audience

- **Game:** "Streamer vs Científico" — arcade-style quiz where players guess whether a phrase was said by a streamer or a scientist.
- **Audience:** Spanish-speaking casual gamers; social sharing (WhatsApp, Discord, Telegram, Facebook) is a key acquisition channel.
- **Project phase:** Existing GitHub repo recovered and redeployed on vite-react; continuing development without altering original features.

## Brand personality & voice

- Playful, arcade, high-contrast "streamer vs scientist" duality.
- UI text and user-facing copy in Spanish (voseo: "Adiviná", "Jugá", "descubrí").
- Title styling: "STREAMER VS CIENTÍFICO" (uppercase).

## Visual design & UX direction

- Arcade aesthetic with strong color contrast representing streamers vs scientists.
- OG image (`public/og-image.png`, 1200×630): real game colors/typography, title, phrase-guessing mechanic composition; readable at small sizes; no Bolt logos/watermarks.
- Favicon: `public/favicon.svg` — red circle with "VS".
- No external/remote images for branding assets; keep them local in `public/` for durability.

## Decisions, constraints & rationale

- **Do not modify:** game name, phrase mechanics, multiplayer, scores, matches, database, existing connections, page design, existing images/phases/features.
- **Allowed scope:** share-preview/SEO metadata, favicon, browser tab identity only.
- Metadata must be static in `index.html` (no JS-dependent crawlers); Twitter card set to `summary_large_image`.
- Description used: "¿Quién dijo esa frase? ¿Un streamer famoso o un científico brillante? Adiviná, sumá puntos y descubrí quién dijo las frases más inesperadas. ¡Jugá gratis!".
- Removed/replaced default Bolt.new preview tags and broken favicon.
- `.bolt/prompt` exists with global UI instructions (beautiful/production-grade designs, JSX + Tailwind + lucide-react, `@/` path alias, no extra UI packages unless necessary).

## Open questions & assumptions

- **Unresolved:** No public deployment URL is present in project config. User must provide the real HTTPS URL to finalize `og:url` and convert `og:image`/`twitter:image` to absolute HTTPS URLs.
- Assumption: deployment URL is whatever Bolt.new assigned at publish time (not invented).
- Assumption: crawlers can read `public/og-image.png` once served from the final domain.