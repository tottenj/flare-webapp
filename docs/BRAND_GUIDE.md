# Flare — Electric Rose Brand Guide

Status: approved basic brand direction; detailed mockups are conceptual, not pixel-perfect implementation specifications.
Tagline: **Ignite Community**.

## Identity
- **Logo direction:** original eight-ray radiating spark, refined for icon scale; modern lowercase `flare` wordmark; tagline `Ignite Community` in full brand lockups, not necessarily in compact navigation.
- **Character:** modern, confident, inclusive, culture-forward, useful. Apple-like restraint with personality through typography and authentic event imagery.
- **Avoid:** excessive rainbow colour, gradients used everywhere, unneeded decoration, stock event imagery masquerading as actual events, loud accent colours in all metadata.

## Typography
- Functional UI, navigation, forms, metadata, body: **Geist**.
- Display and section headings: **Plus Jakarta Sans**, generally bold.
- Suggested sizes: desktop display 48–56px; mobile display 32–38px; section 24–28px; card titles 16–18px; body 15–16px; metadata 13–14px. Maintain responsive hierarchy.

## Colour system — values approved
Use HeroUI v3 semantic tokens. The literal hex values below define brand intent; adapt the precise theme variable names to the installed HeroUI v3 version and its documented CSS system.

| Semantic role | Light | Dark |
| --- | --- | --- |
| background | `#F8F8FA` | `#101014` |
| surface | `#FFFFFF` | `#1C1C23` |
| neutral / secondary surface | `#F1F1F4` | `#292932` |
| foreground | `#17171C` | `#F9F8FA` |
| muted text | `#62636D` | `#B2B0BD` |
| accent | `#C91F60` | `#FF639D` |
| accent foreground | `#FFFFFF` | `#24101B` |
| separator | `#E6E6EA` | `#35353E` |

Modal contrast header can use deep plum-charcoal approximately `#19151F` in either mode; use readable white text and dark-mode rose accent on this header. UI focus states and success/warning/danger should remain semantically meaningful and accessible.

## Shape and spacing
- 4px spacing rhythm, card radius approximately 16px, field radius approximately 12px, dialog radius approximately 20px desktop.
- Clean surface and subtle dividers, not layers of nested cards, heavy drop shadows, or loud borders.
- Desktop content width near 1280px max; responsive mobile with roughly 16px horizontal gutters where possible.

## Approved Explore design
- **Split editorial hero:** concise, bold editorial heading + feature imagery on desktop; naturally stacked on mobile.
- People can browse without requiring account creation or precise location permission.
- Prominent search and useful quick filters (city, date, category, price); expandable filter panel for specialized controls.
- Event listing variants: editorial for featured content, standard info-rich grid for normal discovery, compact list for dense search and saved events.
- Cards should expose date/time, title, location, verified organizer (only when verified), and price, independent of poster text.

## Approved event detail design
- On in-app navigation, a Next.js intercepted route can present a modal; direct event URLs show a standalone event page.
- **Contrast header** with big Plus Jakarta Sans title, subtle rose flourish, compact optional poster that can expand to original size. Do not crop a poster in the expanded view.
- Avoid large poster columns and decorative empty space. Event info determines the natural content height; scroll long descriptions without blank filler.
- Separate summary date/location/organizer from informational tabs: **About**, **Good to know**, **Organizer**.
- Good to know may include confirmed accessibility information, age restrictions, venue/arrival policies, what to bring. Don't imply missing data is verified.
- **One clear ticket-price display** beside the primary Get tickets CTA in the footer; the button should be sticky on mobile and accessible.
- Quiet separators, clear text hierarchy, neutral metadata. Pink is reserved primarily for actions and selected states.

## Artwork and no-image states
- Event posters are usually third-party portraits, often with poor design. Flare must look polished independently of poster quality.
- Don't force portrait posters into wide hero crops. Use a small artwork treatment in the modal; allow expanding the original.
- With no image, **do not render an empty image area**. Let typography and the contrast header lead.
- Compact card fallback: Flare-branded dark date tile and spark; editorial card fallback: branded typographic treatment with title/date. Do not use unrepresentative stock photos.

## Organizer editor preview
- Organizer editing forms should remain usable forms, not literal copies of a public event modal.
- Offer a live preview that reuses published event presentation components. Desktop: editor and preview side by side. Mobile: Edit / Preview switch.
- Reflect optional or missing fields gracefully, without fake details. Keep draft editor state separate from persistence.

## Scope boundaries
This brand guide is not an approved rewrite of authentication, user/organization roles, schemas, or permissions. Keep those decisions separate.
