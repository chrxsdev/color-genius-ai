import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { PaletteResponse, PaletteSchema } from '@/types/api-schema';

/**
 * PaletteGenerator class
 * Handles AI-powered color palette generation with security and validation
 */
export class PaletteGenerator {
  private model = google('gemini-2.0-flash-exp');

  /**
   * Generate a color palette based on user prompt and harmony type
   */
  async generatePalette(prompt: string, harmony: string, colorCount: number = 5): Promise<PaletteResponse> {
    const sanitizedPrompt = this.sanitizeInput(prompt);

    try {
      const result = await generateObject({
        model: this.model,
        schema: PaletteSchema,
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(harmony, colorCount),
          },
          {
            role: 'user',
            content: `Create a ${harmony} color palette for: "${sanitizedPrompt}"`,
          },
        ],
        temperature: 0.7,
        maxRetries: 2,
      });

      return {
        ...result.object,
        metadata: {
          provider: 'google',
          model: 'gemini-2.0-flash-exp',
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('AI generation failed:', error);
      return this.getStaticFallback();
    }
  }

  /**
   * Sanitize user input to prevent prompt injection attacks
   */
  private sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      throw new Error('Invalid input: must be a non-empty string');
    }

    return input
      .trim()
      .replace(/[<>"'`{}]/g, '') // Remove potential injection characters
      .replace(/\b(system|assistant|user):/gi, '') // Remove role indicators
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
      .substring(0, 200); // Limit length
  }

  /**
   * Build system prompt with security-first approach
   */
  private buildSystemPrompt(harmony: string, colorCount: number): string {
    const allowedHarmonies = [
      'monochromatic',
      'analogous',
      'complementary',
      'triadic',
      'tetradic',
      'split-complementary',
    ];
    if (!allowedHarmonies.includes(harmony)) throw new Error(`Invalid harmony type: ${harmony}`);
    if (colorCount < 3 || colorCount > 8) throw new Error(`Invalid color count: ${colorCount}`);

    return `
    You are a color palette generator. Generate exactly ${colorCount} colors following ${harmony} color harmony principles.

    REQUIREMENTS:
    - Return valid JSON matching the provided schema exactly.
    - Each color must include: name, hex (#RRGGBB), and hsl {h,s,l}.
    - Hex must correspond to the given HSL (convert HSL→RGB→HEX).
    - Follow ${harmony} rules strictly.
    - Provide creative names (2–30 chars).
    - Rationale length will be strictly <70 words, without mention the harmony style, just the palette description and rationale.
    - 3–8 tags for discoverability.
    - Consider web accessibility and modern design trends.
    - Ensure colors work well together for web design projects.
      
    SPACING AND DIVERSITY:
    - Enforce minimum pairwise hue separation as specified in harmony rules.
    - Ensure saturation values across the palette span at least 30 points.
    - Ensure lightness values across the palette span at least 25 points.
    - Avoid near-duplicates: no two colors may have both |ΔH| < 10°, |ΔS| < 10, and |ΔL| < 10.
      
    HARMONY RULES: ${this.getHarmonyRules(harmony)}
      
    OUTPUT ORDER:
    - Distribute hues evenly per the harmony (do not cluster).
    - Vary S and L to maximize useful contrast while remaining harmonious.`;
  }

  /**
   * Get specific harmony rules for AI guidance
   */
  private getHarmonyRules(harmony: string): string {
    const rules: Record<string, string> = {
      monochromatic:
        'Work in HSL. Keep hue within ±4° of base H0. Enforce strong diversity: S in [35,85], L in [25,85], with S range ≥ 40 and L range ≥ 35. Avoid any two colors with |ΔH|<6° and |ΔS|<10 and |ΔL|<10.',
      analogous:
        'Work in HSL. Choose base H0. Pick window width W in [24,40]. Place n hues evenly across [H0−W/2, H0+W/2]. Minimum pairwise hue spacing ≥ 20°. Ensure S spans ≥ 40 points and L spans ≥ 35 points across the set.',
      complementary:
        'Work in HSL. Target hues {H0, H0+180°} with ±3° tolerance. If n>2, add neighbors at ±15–25° around each complement. Minimum pairwise hue spacing ≥ 12°. Ensure S range ≥ 30 and L range ≥ 25.',
      triadic:
        'Work in HSL. Target {H0, H0+120°, H0+240°} with ±3°. If n>3, add neighbors at ±10–18° around each target. Min pairwise hue spacing ≥ 12°. Ensure S range ≥ 30 and L range ≥ 25.',
      tetradic:
        'Work in HSL. Target {H0, H0+90°, H0+180°, H0+270°} with ±3°. If n>4, add neighbors at ±10–15° around targets. Min pairwise hue spacing ≥ 10°. Ensure S and L ranges as above.',
      'split-complementary':
        'Work in HSL. Use {H0, H0+180°−(15–30)°, H0+180°+(15–30)°}. Min pairwise hue spacing ≥ 12°. Ensure S range ≥ 30 and L range ≥ 25.',
    };

    return rules[harmony] ?? 'Work in HSL with numeric spacing and S/L diversity constraints.';
  }

  /**
   * Fallback palette when AI generation fails
   */
  private getStaticFallback(): PaletteResponse {
    return {
      colors: [
        {
          name: 'Purple Dawn',
          hex: '#667EEA',
          hsl: { h: 231, s: 72, l: 65 },
        },
        {
          name: 'Deep Violet',
          hex: '#764BA2',
          hsl: { h: 267, s: 39, l: 46 },
        },
        {
          name: 'Pink Mist',
          hex: '#F093FB',
          hsl: { h: 287, s: 89, l: 78 },
        },
        {
          name: 'Coral Pink',
          hex: '#F5576C',
          hsl: { h: 352, s: 89, l: 65 },
        },
        {
          name: 'Sky Blue',
          hex: '#4FACFE',
          hsl: { h: 211, s: 98, l: 66 },
        },
      ],
      rationale: 'A beautiful gradient palette with purple and pink tones, perfect for modern web designs.',
      tags: ['gradient', 'purple', 'pink', 'modern', 'elegant'],
      metadata: {
        provider: 'fallback',
        model: 'static',
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
