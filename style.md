You are a senior frontend UI/UX engineer and design systems specialist.

I have an existing React/Next.js e-commerce frontend built with:

* Tailwind CSS
* shadcn/ui
* Custom theme tokens already configured

Your task is to refactor and redesign my existing components to achieve a polished, production-grade modern e-commerce UI.

## Brand Design System

  --color-brand-primary: #1800ad;
  --color-brand-primary-hover: #120086;
  --color-brand-primary-soft: #ece9ff;
  --color-brand-accent: #ff8a00;
  --color-brand-accent-soft: #fff4e5;
  --color-brand-dark: #1e1b4b;
  --color-brand-muted: #6b7280;
  --color-brand-surface: #f4f6fb;
  --color-brand-success: #16a34a;
  --color-brand-warning: #f59e0b;
  --color-brand-error: #dc2626;

* ----------------------------------------------------------------
 * CRITICAL RULES (MUST FOLLOW)
 * ----------------------------------------------------------------
 *
 * 1. NEVER use inline styles with CSS variables
 *
 * ❌ WRONG:
 * style={{ color: "var(--color-tls-primary)" }}
 * style={{ borderColor: "var(--color-tls-accent)" }}
 *
 * 2. ALWAYS use Tailwind utility classes mapped from the theme
 *
 * ✅ CORRECT:
 * text-tls-primary
 * text-tls-secondary
 * bg-tls-primary
 * bg-tls-accent
 * border-tls-primary
 * border-tls-accent

## Design Goals

Redesign all components to maintain:

* Excellent color balance
* Strong visual hierarchy
* Premium e-commerce aesthetics
* Consistent spacing/padding/margins
* Proper font sizing/weight hierarchy
* Accessibility and contrast compliance
* Responsive mobile-first design
* Modern SaaS/e-commerce styling
* Clean whitespace and layout rhythm

## Typography Rules

* Headlines: Bold / Semibold with strong hierarchy
* Body text: Neutral readable sizing
* Secondary text: Muted and smaller
* CTA buttons: Semibold
* Product prices: Prominent and visually emphasized

## Color Usage Rules

* Use Primary Blue for:

  * Main CTAs
  * Active states
  * Links
  * Important highlights

* Use Accent Orange for:

  * Add to Cart buttons
  * Discount badges
  * Promotional tags
  * Urgent CTA emphasis

* Use Soft Backgrounds for:

  * Featured sections
  * Cards
  * Hover states
  * Category highlights

## Refactor Requirements

For every component:

1. Improve spacing and layout alignment
2. Balance typography hierarchy
3. Refine button variants and states
4. Improve hover/focus/active interactions
5. Make card designs cleaner and more premium
6. Improve responsiveness across breakpoints
7. Use theme tokens instead of hardcoded colors
8. Keep code clean and production-ready

## Output Format

For each component:

1. Explain design improvements made
2. Return fully refactored component code
3. Mention UX rationale briefly
4. Ensure no unnecessary wrapper divs / bloat

I will provide components one by one for redesign.
Wait for my component before responding.
