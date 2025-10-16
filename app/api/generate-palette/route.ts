import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PaletteGenerator } from '@/lib/ai/palette-generator';
import { HARMONY_TYPES, HarmonyType } from '@/types/palette';

/**
 * Request validation schema
 */
const GenerateRequestSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters').max(200, 'Prompt must be less than 200 characters'),
  harmony: z.enum(HARMONY_TYPES.map((type) => type.value)),
  colorCount: z.number().min(3).max(8).default(5),
});

/**
 * POST /api/generate-palette
 * Generates an AI-powered color palette based on user input
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = GenerateRequestSchema.parse(body);

    const { prompt, harmony, colorCount } = validatedData;

    // Generate palette using AI
    const generator = new PaletteGenerator();
    const aiResponse = await generator.generatePalette(prompt, harmony, colorCount);

    // Format response to match frontend expectations
    const palette = {
      id: crypto.randomUUID(),
      paletteName: aiResponse.paletteName,
      colors: aiResponse.colors.map((color, index) => ({
        color: color.hex,
        name: color.name ?? `Color ${index + 1}`,
      })),
      metadata: {
        prompt,
        harmony: harmony as HarmonyType,
        rationale: aiResponse.rationale,
        tags: aiResponse.tags,
        generatedAt: aiResponse.metadata.generatedAt,
      },
    };

    return NextResponse.json(palette, { status: 200 });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error({ error });
    return NextResponse.json(
      {
        error: 'Failed to generate palette',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
