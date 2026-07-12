# Sprint 01 - Header

## Goal

Implement a production-ready responsive navigation header.

---

## Tasks

- [x] Desktop Navigation
- [x] Mobile Navigation
- [x] Logo
- [x] Navigation Links
- [x] Social Icons
- [x] Resume Button
- [x] Theme Toggle
- [x] Accessibility
- [x] Responsive
- [x] Keyboard Navigation

---

## Definition of Done

- Pixel-perfect
- Responsive
- Accessible
- Lighthouse Friendly
- Reusable

---

## Scope

Implement **only** the Header.

Do not modify homepage sections, Footer content, or unrelated styles beyond what Header requires.

## Component Tree

```
Header
│
├── Logo
│
├── DesktopNav
│
├── Actions
│      SocialLinks
│      ThemeToggle
│      Resume CTA (Button)
│
└── MobileNav
```

## Reference

Homepage design mockup — header bar with logo, centered nav, social icons, theme toggle, and Download Resume CTA.

## Notes

- New folder: `src/data/` for site/navigation/social config
- Header moved from `components/layout/` → `components/navigation/`
- Minimal dark-theme tokens added so Theme Toggle is functional
