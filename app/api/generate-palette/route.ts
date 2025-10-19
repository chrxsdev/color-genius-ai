import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { PaletteGenerator } from '@/lib/ai/palette-generator';
import { GenerateRequestSchema } from '@/infrastructure/schemas/api-generate-palette.schema';
import { HarmonyType } from '@/infrastructure/types/harmony-types.type';

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
          error: error.issues[0].message ?? 'Invalid Values',
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
