import { generateObject, LanguageModel } from 'ai';
import { google } from '@ai-sdk/google';
import { PaletteResponse, PaletteSchema } from '@/types/api-schema';
import { hslToHex } from '@/utils/color-conversions/code-color-conversions';

/**
 * PaletteGenerator class
 * Handles AI-powered color palette generation with security and validation
 */
export class PaletteGenerator {
  private readonly model: LanguageModel;

  // Color distance weights for perceptual similarity
  private readonly HUE_WEIGHT = 2.0;
  private readonly SATURATION_WEIGHT = 1.0;
  private readonly LIGHTNESS_WEIGHT = 1.0;

  constructor() {
    // Check for API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY');
    this.model = google('gemini-2.0-flash-exp');
  }

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

      // Enforce color diversity through post-generation validation
      const validatedColors = this.enforceColorDiversity(result.object.colors, harmony);

      return {
        ...result.object,
        colors: validatedColors,
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
    You are an expert color palette generator. Generate exactly ${colorCount} colors following ${harmony} color harmony principles.

    CRITICAL REQUIREMENTS (YOU MUST FOLLOW THESE):
    - Return valid JSON matching the provided schema EXACTLY.
    - Each color MUST include: name, hex (#RRGGBB format), and hsl {h,s,l}.
    - Hex MUST correspond to the given HSL values (convert HSL→RGB→HEX accurately).
    - Follow ${harmony} harmony rules with MATHEMATICAL PRECISION.
    - Provide creative, descriptive names (2–30 characters).
    - Rationale MUST be <70 words, describing the palette WITHOUT mentioning the harmony style.
    - Include 3–8 relevant tags for discoverability.
    - Consider web accessibility (WCAG contrast) and modern design trends.
      
    DIVERSITY ENFORCEMENT (MANDATORY):
    - NO TWO COLORS may be visually similar or near-duplicates.
    - MINIMUM hue separation as specified in harmony rules (see below).
    - Saturation (S) values MUST span at least 35 points across the palette.
    - Lightness (L) values MUST span at least 30 points across the palette.
    - FORBIDDEN: Two colors with |ΔH| < 15°, |ΔS| < 12, AND |ΔL| < 12 simultaneously.
    - For monochromatic: Since hue is limited, you MUST vary S and L dramatically (S range ≥ 45, L range ≥ 40).
      
    HARMONY RULES: ${this.getHarmonyRules(harmony)}
      
    OUTPUT STRUCTURE:
    - Distribute hues evenly per the harmony (DO NOT cluster colors).
    - Vary S and L strategically to create visual contrast while maintaining harmony.
    - Order colors logically (e.g., by hue progression, lightness gradient, or visual flow).
    
    REMEMBER: Each color must be DISTINCTLY DIFFERENT from all others. Avoid subtle variations that look identical.`;
  }

  /**
   * Get specific harmony rules for AI guidance
   */
  private getHarmonyRules(harmony: string): string {
    const rules: Record<string, string> = {
      monochromatic:
        'Work in HSL. Keep hue within ±5° of base H0. YOU MUST create STRONG diversity through saturation and lightness: S must range from 20–85 (span ≥ 45 points), L must range from 20–85 (span ≥ 40 points). CRITICAL: Ensure every pair of colors differs by at least 15 points in S OR 15 points in L. Example good palette: H=210° constant, S=[25,45,65,85], L=[30,50,70,85].',
      analogous:
        'Work in HSL. Choose base hue H0. Select window width W between 30–45°. Distribute ${colorCount} hues EVENLY across [H0−W/2, H0+W/2]. MANDATORY minimum spacing between adjacent hues: ≥ 25°. Vary S across 40+ points (e.g., 30–75) and L across 35+ points (e.g., 25–70). Example: H0=180°, W=40°, hues=[160°,170°,180°,190°,200°].',
      complementary:
        'Work in HSL. Primary hues are {H0, H0+180°} (±4° tolerance). If ${colorCount}>2, add tints/shades or neighbors at ±18–28° around each primary hue. MINIMUM pairwise hue spacing: ≥ 15°. Ensure S spans 35+ points and L spans 30+ points. Example for 5 colors: H=[30°, 50°, 210°, 230°, 195°].',
      triadic:
        'Work in HSL. Target hues {H0, H0+120°, H0+240°} (±4° tolerance). If ${colorCount}>3, add variations at ±12–20° around each target. MINIMUM pairwise hue spacing: ≥ 15°. Vary S by 35+ points and L by 30+ points. Example: H=[20°, 35°, 140°, 155°, 260°].',
      tetradic:
        'Work in HSL. Target hues {H0, H0+90°, H0+180°, H0+270°} (±4° tolerance). If ${colorCount}>4, add variations at ±10–18° around targets. MINIMUM pairwise hue spacing: ≥ 12°. Ensure S and L diversity (35+ and 30+ point ranges). Example: H=[0°, 15°, 90°, 180°, 270°].',
      'split-complementary':
        'Work in HSL. Use base H0 and two complements: {H0, H0+180°−25°, H0+180°+25°} (±4° tolerance). MINIMUM pairwise hue spacing: ≥ 15°. Vary S by 35+ points and L by 30+ points. Example: H=[40°, 155°, 205°, 220°, 50°].',
    };

    return (
      rules[harmony] ??
      'Work in HSL with numeric spacing and S/L diversity constraints. Ensure all colors are visually distinct.'
    );
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

  /**
   * Calculate perceptual distance between two colors in HSL space
   * Uses weighted Euclidean distance with emphasis on hue differences
   */
  private calculateColorDistance(
    hsl1: { h: number; s: number; l: number },
    hsl2: { h: number; s: number; l: number }
  ): number {
    // Handle hue circularity (0° and 360° are the same)
    let hueDiff = Math.abs(hsl1.h - hsl2.h);
    if (hueDiff > 180) {
      hueDiff = 360 - hueDiff;
    }

    // Normalize all values to 0-1 range
    const normalizedHueDiff = hueDiff / 180;
    const normalizedSatDiff = Math.abs(hsl1.s - hsl2.s) / 100;
    const normalizedLightDiff = Math.abs(hsl1.l - hsl2.l) / 100;

    // Calculate weighted Euclidean distance
    const distance = Math.sqrt(
      Math.pow(normalizedHueDiff * this.HUE_WEIGHT, 2) +
        Math.pow(normalizedSatDiff * this.SATURATION_WEIGHT, 2) +
        Math.pow(normalizedLightDiff * this.LIGHTNESS_WEIGHT, 2)
    );

    return distance;
  }

  /**
   * Get minimum distance threshold based on harmony type
   * Different harmonies have different spacing requirements
   */
  private getMinimumDistance(harmony: string): number {
    const thresholds: Record<string, number> = {
      monochromatic: 0.25, // Higher threshold due to limited hue range
      analogous: 0.35, // Moderate threshold for nearby hues
      complementary: 0.3, // Moderate threshold
      triadic: 0.28, // Slightly lower for 3-way split
      tetradic: 0.25, // Lower for 4-way split
      'split-complementary': 0.3, // Moderate threshold
    };

    return thresholds[harmony] ?? 0.3; // Default threshold
  }

  /**
   * Check if all colors in palette meet minimum distance requirements
   * Returns indices of colors that are too similar
   */
  private findSimilarColors(
    colors: Array<{ hsl: { h: number; s: number; l: number } }>,
    harmony: string
  ): Array<[number, number]> {
    const minDistance = this.getMinimumDistance(harmony);
    const similarPairs: Array<[number, number]> = [];

    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const distance = this.calculateColorDistance(colors[i].hsl, colors[j].hsl);
        if (distance < minDistance) {
          similarPairs.push([i, j]);
        }
      }
    }

    return similarPairs;
  }

  /**
   * Adjust a color to increase distance from another color
   * Modifies HSL values while respecting harmony constraints
   */
  private adjustColor(
    color: { h: number; s: number; l: number },
    targetColor: { h: number; s: number; l: number },
    harmony: string
  ): { h: number; s: number; l: number } {
    const adjusted = { ...color };

    // For monochromatic, only adjust saturation and lightness (hue must stay similar)
    if (harmony === 'monochromatic') {
      // Increase saturation difference
      if (Math.abs(adjusted.s - targetColor.s) < 20) {
        adjusted.s = adjusted.s > 50 ? Math.min(95, adjusted.s + 15) : Math.max(10, adjusted.s - 15);
      }
      // Increase lightness difference
      if (Math.abs(adjusted.l - targetColor.l) < 20) {
        adjusted.l = adjusted.l > 50 ? Math.min(90, adjusted.l + 15) : Math.max(15, adjusted.l - 15);
      }
    } else {
      // For other harmonies, adjust hue primarily
      let hueDiff = Math.abs(adjusted.h - targetColor.h);
      if (hueDiff > 180) {
        hueDiff = 360 - hueDiff;
      }

      if (hueDiff < 20) {
        // Shift hue away from target
        const shiftDirection = adjusted.h > targetColor.h ? 1 : -1;
        adjusted.h = (adjusted.h + shiftDirection * 25 + 360) % 360;
      }

      // Also adjust saturation and lightness for extra diversity
      if (Math.abs(adjusted.s - targetColor.s) < 15) {
        adjusted.s = adjusted.s > 50 ? Math.min(95, adjusted.s + 12) : Math.max(15, adjusted.s - 12);
      }
      if (Math.abs(adjusted.l - targetColor.l) < 15) {
        adjusted.l = adjusted.l > 50 ? Math.min(85, adjusted.l + 12) : Math.max(20, adjusted.l - 12);
      }
    }

    return adjusted;
  }

  /**
   * Enforce color diversity by validating and adjusting similar colors
   * This is the main orchestration function for post-generation validation
   */
  private enforceColorDiversity(
    colors: Array<{ name: string; hex: string; hsl: { h: number; s: number; l: number } }>,
    harmony: string
  ): Array<{ name: string; hex: string; hsl: { h: number; s: number; l: number } }> {
    const maxIterations = 10; // Prevent infinite loops
    let iteration = 0;
    let adjustedColors = [...colors];

    while (iteration < maxIterations) {
      const similarPairs = this.findSimilarColors(adjustedColors, harmony);

      if (similarPairs.length === 0) {
        // All colors are sufficiently different
        break;
      }

      // Adjust the second color in each similar pair
      const adjustedIndices = new Set<number>();
      for (const [_index1, index2] of similarPairs) {
        if (!adjustedIndices.has(index2)) {
          const targetColor = adjustedColors[_index1].hsl;
          const adjustedHsl = this.adjustColor(adjustedColors[index2].hsl, targetColor, harmony);

          // Update both HSL and HEX
          adjustedColors[index2] = {
            ...adjustedColors[index2],
            hsl: adjustedHsl,
            hex: hslToHex(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l),
          };

          adjustedIndices.add(index2);
        }
      }

      iteration++;
    }

    return adjustedColors;
  }
}
