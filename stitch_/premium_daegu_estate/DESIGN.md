---
name: Premium Daegu Estate
colors:
  surface: '#fbf8fc'
  surface-dim: '#dbd9dc'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f6'
  surface-container: '#efedf0'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e4e2e5'
  on-surface: '#1b1b1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#303033'
  inverse-on-surface: '#f2f0f3'
  outline: '#75777f'
  outline-variant: '#c5c6cf'
  surface-tint: '#4e5e81'
  primary: '#031635'
  on-primary: '#ffffff'
  primary-container: '#1a2b4b'
  on-primary-container: '#8293b8'
  inverse-primary: '#b6c6ef'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#141819'
  on-tertiary: '#ffffff'
  tertiary-container: '#292c2e'
  on-tertiary-container: '#909395'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#b6c6ef'
  on-primary-fixed: '#081b3a'
  on-primary-fixed-variant: '#364768'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e2e5'
  danger-red: '#EF4444'
  success-green: '#10B981'
  heart-accent: '#F43F5E'
  text-primary: '#0F172A'
  text-secondary: '#475569'
  text-muted: '#94A3B8'
typography:
  display-lg:
    fontFamily: Noto Sans KR
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Sans KR
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Noto Sans KR
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Noto Sans KR
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  title-md:
    fontFamily: Noto Sans KR
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Noto Sans KR
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Noto Sans KR
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Noto Sans KR
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.2'
  caption:
    fontFamily: Noto Sans KR
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  section-gap: 4rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is anchored in the principles of **Expertise, Trust, and Minimalism**. It is tailored for the South Korean real estate market, specifically Daegu, where accuracy and professional authority are paramount. The visual language moves away from the utility-heavy look of traditional listing sites toward a high-fidelity, "Premium Corporate" aesthetic.

The design style is **Corporate / Modern** with a touch of **Minimalism**. It utilizes expansive white space to reduce cognitive load while presenting complex financial data. The interface feels light and airy, yet grounded by a authoritative primary navy color. Key emotional responses should be confidence in the data and ease of navigation through dense information.

## Colors

The palette is dominated by **Deep Navy (#1A2B4B)** to evoke a sense of institutional stability and professional expertise. **Crisp Blue (#3B82F6)** serves as the functional accent, highlighting interactive elements, active states, and call-to-action buttons.

The background uses **Light Gray (#F8FAFC)** as a soft alternative to pure white, reducing screen glare during long sessions of data analysis. Text is rendered in varying shades of slate to maintain a soft but high-contrast readability. Functional colors for status (success, error) and social interaction (hearts) are used sparingly to ensure they stand out against the professional backdrop.

## Typography

This design system exclusively uses **Noto Sans KR** to ensure perfect legibility for Korean characters across all weights. The hierarchy is strictly enforced to help users parse complex data quickly.

- **Headlines** utilize heavier weights (700) and tighter letter-spacing to appear confident and modern.
- **Body text** uses a generous line height (1.6) to ensure that descriptions and legal fine print remain readable.
- **Data points** (such as prices and square footage) should use the Semi-Bold or Bold weights to draw the eye first within property cards.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop screens to maintain a high-end editorial feel, centering content within a 1280px container. On smaller screens, the system transitions to a fluid fluid model with consistent 16px side margins.

A **12-column grid** is used for the dashboard and listing views. Real estate listings and analysis cards typically span 3 columns on desktop (4-up layout) and 6 columns on tablet (2-up layout), collapsing to a single column on mobile. 

Spacing is intentionally generous. We use a **section gap of 4rem (64px)** to separate major functional areas (e.g., Search Map from Analysis Summary), giving the "Premium" feel requested.

## Elevation & Depth

To achieve a "Premium" feel without clutter, this design system utilizes **Tonal Layers** combined with **Ambient Shadows**.

1.  **Level 0 (Base):** The main background using the soft Light Gray (#F8FAFC).
2.  **Level 1 (Cards/Containers):** Pure white (#FFFFFF) surfaces with a very subtle, highly diffused shadow (e.g., `0 4px 20px rgba(26, 43, 75, 0.05)`). This creates a soft lift that suggests quality without looking "heavy."
3.  **Level 2 (Modals/Active States):** Elevated surfaces with a more pronounced shadow to indicate focus. 
4.  **Interactions:** Hovering over a property card should result in a slight vertical lift (-4px) and a deepening of the shadow, providing tactile feedback that the item is interactive.

## Shapes

The design system uses a **Rounded (Level 2)** shape language. The base corner radius for most components is **0.5rem (8px)**, but for larger container cards and primary buttons, we scale up to **0.75rem (12px) or 1rem (16px)** to emphasize a modern, friendly, and premium feel. 

Pill-shaped (fully rounded) containers are reserved exclusively for status tags and small filters (e.g., apartment size toggles) to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Deep Navy background with white text. 12px border radius. High-contrast and authoritative.
- **Secondary/Ghost:** Transparent background with Blue (#3B82F6) border and text. Used for secondary actions like "Add to Favorites."

### Input Fields
- Fields use a white background with a subtle 1px border in Light Gray. On focus, the border transitions to Primary Navy with a soft blue outer glow to guide the user's attention.

### Property & Analysis Cards
- White containers with 16px padding and 16px corner radius.
- Headers within cards use `title-md` for the district or building name.
- Real-time price data is emphasized with Primary Navy and `headline-md` size.

### Map Markers & Icons
- Map markers use a "Pin" shape in Primary Navy with the Blue accent used for selected/active buildings. 
- Icons should be drawn from a clean, line-based library (like Lucide) using a 2px stroke weight to match the refined typography.

### Chips & Filters
- Used for square footage (59㎡, 84㎡). These should be pill-shaped with a light blue background (#EFF6FF) and blue text when active, and a neutral gray background when inactive.