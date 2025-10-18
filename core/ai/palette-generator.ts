import { generateObject, LanguageModel } from 'ai';
import { google } from '@ai-sdk/google';
import { hslToHex } from '@/utils/color-conversions/code-color-conversions';
import {
  getPaletteNameSystemPrompt,
  getPaletteNameUserPrompt,
  getPaletteGenerationSystemPrompt,
  getPaletteGenerationUserPrompt,
  getHarmonyRules,
} from '@/utils/prompts/ai-prompts';
import { PaletteResponse, PaletteSchema } from '@/schemas/api-palette-response.schema';
import { PaletteNameSchema } from '@/schemas/palette-name.schema';

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
            content: getPaletteGenerationSystemPrompt({
              harmony,
              colorCount,
              harmonyRules: getHarmonyRules(harmony),
            }),
          },
          {
            role: 'user',
            content: getPaletteGenerationUserPrompt(harmony, sanitizedPrompt),
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
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('AI generation failed:', { error });
      // In case of error, return a static fallback palette by default
      return this.getStaticFallback();
    }
  }

  /**
   * Regenerate a palette name based on the rationale
   * Uses the existing rationale to maintain thematic consistency
   */
  async regenerateName(params: { rationale: string; harmony: string; generatedNames: string[] }): Promise<string> {
    const { rationale, generatedNames, harmony } = params;
    const sanitizedRationale = this.sanitizeInput(rationale);
    const timestamp = Date.now();

    try {
      return await this.generatePaletteName({
        rationale: sanitizedRationale,
        timestamp,
        harmony,
        generatedNames,
      });
    } catch (error) {
      console.error(`Failed to regenerate palette name:`, { error });
      return this.generateFallbackName();
    }
  }

  /**
   * Generate a new palette name using AI
   */
  private async generatePaletteName(params: {
    rationale: string;
    timestamp: number;
    harmony: string;
    generatedNames: string[];
  }): Promise<string> {
    const { object } = await generateObject({
      model: this.model,
      schema: PaletteNameSchema,
      messages: [
        {
          role: 'system',
          content: getPaletteNameSystemPrompt(params),
        },
        {
          role: 'user',
          content: getPaletteNameUserPrompt(params),
        },
      ],
      temperature: 0.95,
      maxRetries: 2,
    });

    return object.paletteName;
  }

  /**
   * Generate a fallback name when AI generation fails
   */
  private generateFallbackName(): string {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `Geni ${randomId}`;
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
   * Fallback palette when AI generation fails
   */
  private getStaticFallback(): PaletteResponse {
    return {
      paletteName: 'Geni on Vacation',
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
        {
          name: 'Dark Blue',
          hex: '#233D54',
          hsl: { h: 208, s: 41, l: 23 },
        },
      ],
      rationale:
        'A beautiful gradient palette with purple and pink tones, perfect for modern web designs (Geni is on vacation...).',
      tags: ['gradient', 'purple', 'pink', 'modern', 'elegant'],
      metadata: {
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
      split_complementary: 0.3, // Moderate threshold
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
        adjusted.h = (adjusted.h + shiftDirection * 35 + 360) % 360;
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
