# Frontend Enhancement Phase 1: Landing Page

## Goal
Elevate the main landing page (`views/index.html`) to a premium B2B enterprise standard, matching the aesthetic of the Sentinel onboarding app.

## Proposed Changes

### [MODIFY] [style.css](file:///var/www/aegisight.a/public/css/style.css)
-   **Typography**: Enforce `Montserrat` for headers and `Inter` for body (already present, verify weights).
-   **Glow Effects**: Add `.text-glow` and `.border-glow` utility classes to match Sentinel's neon aesthetic.
-   **Buttons**: Unified "CTA" styles (gradients, rounded-full, shadows).

### [MODIFY] [views/index.html](file:///var/www/aegisight.a/views/index.html)
-   **Header**: Add the "Secure Session" indicator (lock icon) similar to Sentinel App to reinforce the unified platform feel.
-   **Hero Content**:
    -   Update sub-headline to explicitly mention "AI Fingerprint Detection".
    -   Replace static logo description with "Verified Signature" terminology where appropriate.
-   **Visuals**: Replace generic placeholders with "Data Stream" or "Shield" motifs used in Sentinel.

## Verification
-   **Visual Check**: Compare `localhost:3006/` side-by-side with `localhost:3006/onboarding`.
-   **Consistency**: Ensure the transition from Landing -> Onboarding feels seamless.
