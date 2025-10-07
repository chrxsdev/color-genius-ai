## Color Genius AI a Color Palette Generator App
An AI-first app that generates usable, web-ready color palettes from a user’s text natural language. The AI returns a complete creative package (palette HEX codes, names, rationale, tags). The client verifies and gently corrects the AI output using color-science rules, then applies user-controlled sliders for brightness, saturation, and warmth. Users visualize colors on a wheel, preview a gradient or UI element, and copy Tailwind/CSS snippets.

### Key points
- AI-driven generation
  - The model returns N HEX colors, names, rationale, tags, a gradient, and font pairings based on the user prompt and selected harmony.
  - Strict JSON schema to keep outputs reliable and parseable.

- Guardrails and corrections
  - Validate colors for sRGB gamut, distinctness (ΔE threshold), and harmony conformity (Analogous, Complementary, Triadic, Monochromatic).
  - Apply minimal corrections when needed. Re-prompt on major issues.

- Perceptual controls
  - Use OKLCH for internal color math so sliders feel natural:
    - Brightness adjusts lightness (L).
    - Saturation scales chroma (C).
    - Warmth slightly shifts hue (H).

- Visualizations and exports
  - Render swatches with names and accessibility badges.
  - Color wheel placing each color by hue angle.
  - Section with all the colors generated.
  - Copy-to-clipboard for Tailwind config, CSS variables, and gradient utilities.
  - User can enable option to save palettes to their account and visibility in explore section, disabled by default.

- Architecture
  - Nextjs with Redux as State Management and a color-engine utility module.
  - Authentication with Supabase.
  - Supabase Edge Function to call the LLM securely and return strict JSON.
  - Optional persistence in Supabase (palettes, colors, metadata) with RLS if auth is enabled.

- UX and accessibility
  - Minimum of 4 colors; default 5; adjustable by the user.
  - Live slider adjustments without re-calling AI.
  - Contrast checks against light/dark backgrounds using WCAG guidance.

- Security and reliability
  - LLM key stored as a Supabase secret; never exposed to the client.
  - Input and output validation with zod on both server and client.
  - Rate limiting and short timeouts; minimal logging without storing prompts unless user opts in.

- Future-ready
  - Tags enable browsing and recommendations later with a explore feature.
  - Attach images to generate palettes from photos