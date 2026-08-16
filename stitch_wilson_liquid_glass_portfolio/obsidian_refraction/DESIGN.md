---
name: Obsidian Refraction
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0e1c2d'
  surface-container: '#122031'
  surface-container-high: '#1d2b3c'
  surface-container-highest: '#283647'
  on-surface: '#d5e4fa'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#d5e4fa'
  inverse-on-surface: '#233143'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#89ceff'
  on-tertiary: '#00344d'
  tertiary-container: '#009ada'
  on-tertiary-container: '#002d43'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#051424'
  on-background: '#d5e4fa'
  surface-variant: '#283647'
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 84px
    fontWeight: '800'
    lineHeight: 92px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  margin-mobile: 20px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style

The design system is centered around the concept of **Liquid Glass**, a high-fidelity aesthetic that blends technical precision with premium depth. It is tailored for high-level engineering and research professionals, specifically targeting computer engineers and data scientists.

The style is a refined evolution of **Glassmorphism**, characterized by:
- **Translucency:** UI elements are treated as physical layers of glass with high backdrop blur (32px+) to maintain legibility over complex backgrounds.
- **Precision:** Thin, 1px borders with varying opacities simulate the edge of a glass pane catching a light source.
- **Technicality:** A "near-black" foundation provides a void-like depth, allowing accent glows and high-contrast typography to feel luminous rather than loud.
- **Atmospheric Depth:** Usage of subtle inner shadows and specular highlights to create a sense of three-dimensional layering without relying on traditional drop shadows.

## Colors

The palette is rooted in a deep, nocturnal spectrum to minimize eye strain during technical work while providing a premium canvas for data visualization.

- **Foundational Surfaces:** Use `#051424` as the absolute base. Layered surfaces use semi-transparent variations of the neutral palette mixed with backdrop blurs.
- **Accents:** The primary accent is a vibrant electric blue transitioning into a sophisticated violet. This should be used sparingly for high-intent actions, progress indicators, and data highlights.
- **Glass Borders:** Borders are never solid. They use a linear gradient from top-left to bottom-right, transitioning from a semi-transparent white (highlight) to a fully transparent or deep navy (shadow).
- **Text Tiers:** 
    - Primary: Pure white or high-purity off-white for maximum contrast.
    - Secondary: Cool grays with a slight blue tint to maintain harmony with the dark environment.

## Typography

This design system utilizes **Geist** for its systematic, monolinear quality that bridges the gap between Swiss design and technical engineering.

- **Hero Headings:** Use `display-xl` for portfolio headers. The extremely tight letter spacing and heavy weight create a high-impact, editorial feel.
- **Technical Readability:** For data-heavy admin views, `body-md` is the standard. 
- **Monospace Integration:** **JetBrains Mono** is used for labels, metadata, and code snippets to honor the "Computer Engineer" target audience.
- **Contrast Hierarchy:** Use font-weight and opacity rather than just color to differentiate information. Labels should often be uppercase with slight letter spacing for a "technical readout" aesthetic.

## Layout & Spacing

The layout is governed by a 12-column grid system with generous outer margins to emphasize the "floating" nature of the glass components.

- **Desktop:** 12 columns, 24px gutter, 80px+ horizontal padding for the main container.
- **Mobile:** 4 columns, 16px gutter, 20px horizontal padding.
- **Rhythm:** Use a strict 8px base grid. Components should be spaced in multiples of 8 (16, 32, 64) to maintain technical cleanliness.
- **Composition:** In the dashboard, use a "Sidebar + Floating Header" structure. The sidebar should be a full-height glass pane, while the main content area utilizes cards to separate data clusters.

## Elevation & Depth

Elevation is achieved through "Stacking and Blurring" rather than traditional shadows.

- **Level 0 (Base):** Deep navy `#051424`.
- **Level 1 (Main Surfaces):** `rgba(255, 255, 255, 0.03)` with a 32px backdrop blur. This is for large containers and background sections.
- **Level 2 (Cards/Floating Elements):** `rgba(255, 255, 255, 0.07)` with 40px backdrop blur. This level receives the "Glass Border" (a 1px stroke with 20% white opacity).
- **Level 3 (Popovers/Tooltips):** `rgba(255, 255, 255, 0.12)` with 64px backdrop blur. Add a subtle outer glow using the primary accent color at 5% opacity to simulate light refraction.
- **Internal Highlights:** Apply a 1px inner-shadow (inset) at the top of cards with `rgba(255, 255, 255, 0.1)` to simulate a light source from above hitting the glass edge.

## Shapes

The shape language is controlled and geometric.

- **Standard Radius:** 0.5rem (8px) is the default for most interactive components like buttons and inputs.
- **Large Cards:** Use `rounded-xl` (1.5rem / 24px) to give a softer, more premium "object" feel to major UI sections.
- **Capsules:** Navigation items, chips, and tags should use a fully rounded (pill) shape to contrast against the more rigid grid structure.

## Components

- **Glass Cards:** The core component. Must have `backdrop-filter: blur(32px)`, a 1px border (`rgba(255,255,255,0.1)`), and a subtle gradient background.
- **Floating Capsules:** Navigation bars and action pill-buttons. These should appear as high-density glass with a slightly higher background opacity.
- **Buttons:** 
    - *Primary:* Solid electric blue with a subtle outer glow.
    - *Secondary:* Glass-style with a semi-transparent white border and hover-fill effect.
- **Inputs:** Darker than the card background to create a "recessed" look. Use a focus state that illuminates the entire border in the primary blue accent.
- **Data Tables:** Use thin 1px horizontal dividers instead of alternating row colors. Headers should be in monospace `code-sm` font with 50% opacity.
- **Glow Elements:** Use decorative "Blobs" behind the glass layers—large, low-opacity radial gradients of blue and violet that move slowly to simulate a liquid environment.