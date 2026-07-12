# Design Language

> Version: 1.0
> Project: iMayankKumar.com

---

## Feeling

When someone visits iMayankKumar.com, they should feel:

- Professional
- Calm
- Minimal
- Technical
- Premium
- Trustworthy

They should not feel:

- Flashy
- Colorful
- Gaming
- Futuristic
- Heavy animations

This site sells engineering credibility, not spectacle.

---

## Typography

| Purpose  | Font           |
| -------- | -------------- |
| Headings | Geist          |
| Body     | Geist          |
| Code     | JetBrains Mono |

Geist is modern, highly readable, and premium without distraction — a strong fit for a technical personal brand.

---

## Color Palette

| Token               | Value     | Role              |
| ------------------- | --------- | ----------------- |
| Primary             | `#2563EB` | Accent / CTAs     |
| Background          | `#FFFFFF` | Page background   |
| Surface             | `#F8FAFC` | Subtle panels     |
| Text                | `#111827` | Primary content   |
| Secondary Text      | `#6B7280` | Supporting copy   |
| Border              | `#E5E7EB` | Dividers / edges  |

Dark mode will come later.

---

## Design Tokens

All visual values live in `src/styles/tokens.css`.

`global.css` imports those tokens and applies base styles.

Do not hardcode colors, spacing, or radii in components — use tokens.
