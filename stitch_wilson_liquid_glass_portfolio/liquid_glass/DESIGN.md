---
name: Liquid Glass
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#d4e4fa'
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
  tertiary: '#c0c6de'
  on-tertiary: '#2a3043'
  tertiary-container: '#8a90a7'
  on-tertiary-container: '#23293c'
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
  tertiary-fixed: '#dce1fb'
  tertiary-fixed-dim: '#c0c6de'
  on-tertiary-fixed: '#151b2d'
  on-tertiary-fixed-variant: '#40465a'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 120px
---

## Brand & Style

The design system is centered on the persona of a high-end technical expert, blending the precision of a Computer Engineer with the visionary nature of an AI researcher. The aesthetic is "Liquid Glass"—a sophisticated evolution of Glassmorphism that emphasizes depth, clarity, and fluid movement.

The style leans into **Minimalism** and **Glassmorphism**, utilizing heavy backdrop blurs (20px+) and ultra-thin, low-opacity borders to simulate physical glass panes. The emotional response should be one of quiet confidence, cutting-edge technical prowess, and premium quality, reminiscent of high-end desktop operating systems.

## Colors

The palette is built on a "Deep Space" foundation to maximize the luminosity of glass layers.

- **Background**: The base is a solid Deep Navy (#020617).
- **Primary Accent**: Electric Blue (#3B82F6) used for interactive states and primary call-to-actions.
- **Secondary Accent**: Blue-Violet (#8B5CF6) used for data visualization highlights and subtle ambient glows.
- **Glass Surfaces**: Use a white or navy fill with 3% to 8% opacity combined with a high `backdrop-filter: blur()`.
- **Glows**: Implement secondary accent colors as large, diffused "blob" gradients (opacity 10-15%) positioned behind glass surfaces to create depth.

## Typography

This design system uses **Geist** for its systematic, technical, yet elegant appearance. Typography is treated as a structural element. 

- **Display & Headlines**: Use heavy weights (700-800) with tight tracking to create a "locked-in" professional look.
- **Labels**: **JetBrains Mono** is introduced for secondary labels, tags, and technical metadata (like dates or skill categories) to lean into the engineering brand.
- **Contrast**: Maintain a strict hierarchy where headlines are pure Soft White (#F8FAFC) and body text is Cool Gray (#94A3B8) to ensure readability against blurred backgrounds.

## Layout & Spacing

The layout follows a **Fluid Grid** approach with generous vertical breathing room to emphasize the "premium" feel. 

- **Desktop**: A 12-column grid with a 1200px max-width. Use 24px gutters.
- **Mobile**: Single column with 20px side margins.
- **Rhythm**: Sections should be separated by large gaps (120px+) to allow the ambient background glows to breathe.
- **Alignment**: Center-align hero content for impact; use left-aligned layouts for content-heavy sections like the experience timeline or blog entries.

## Elevation & Depth

Depth is not communicated through traditional shadows, but through **Tonal Layering and Backdrop Blurs**.

1.  **Level 0 (Base)**: Solid Deep Navy (#020617) with subtle noise/grain texture (3% opacity) overlaid.
2.  **Level 1 (Cards)**: Background: `rgba(255, 255, 255, 0.03)`, Backdrop Blur: 12px, Border: 1px solid `rgba(255, 255, 255, 0.1)`.
3.  **Level 2 (Navigation/Modals)**: Background: `rgba(255, 255, 255, 0.08)`, Backdrop Blur: 24px, Border: 1px solid `rgba(255, 255, 255, 0.2)`.
4.  **Shadows**: Use very large, soft, colored shadows (0 20px 50px rgba(0,0,0,0.5)) only on the highest floating elements to separate them from the secondary glass layers.

## Shapes

The design system uses a **Rounded** language (0.5rem base) to soften the technical nature of the content and mirror the fluid "liquid" theme. 

- **Cards & Inputs**: Use `rounded-lg` (1rem).
- **Buttons & Pills**: Use `rounded-full` (9999px) for a modern, tactile feel that contrasts against the rectangular grid.
- **Experience Timeline**: The vertical line should have rounded caps, and nodes should be small circles with a centered glow.

## Components

- **Floating Glass Nav**: A centered, pill-shaped container. It should remain fixed at the top with a high backdrop blur and a thin top-light border to simulate a "glint" of light.
- **Layered Glass Cards**: Cards should feature a subtle hover transition where the border opacity increases and the background tint shifts slightly toward the primary accent color.
- **Pills/Tags**: Small, high-contrast capsules using the `label-mono` typography. Backgrounds should be 10% opacity of the accent color with a matching solid text color.
- **Vertical Timeline**: A minimal 2px wide line in Cool Gray. Active nodes use the Blue-Violet glow. Each entry is a glass card that "hangs" from the node.
- **Input Fields**: Ghost-style inputs. Solid 1px border at 10% opacity that brightens to 50% Primary Blue on focus. Use a subtle glass fill to ensure text is readable over background blobs.
- **Buttons**:
    - *Primary*: Solid Electric Blue with a white label. 
    - *Secondary*: Glass background with a 1px white border at 20% opacity.
- **Visual Texture**: Apply a global "grain" SVG filter over the entire UI at a very low alpha to give the glass a physical, premium texture.