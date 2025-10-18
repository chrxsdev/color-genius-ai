import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PaletteGenerator } from '@/utils/ai/palette-generator';
import { HARMONY_TYPES } from '@/types/palette';

/**
 * Request validation schema for name regeneration
 */
const RegenerateNameRequestSchema = z.object({
  rationale: z.string().min(10, 'Rationale must be at least 10 characters'),
  harmony: z.enum(HARMONY_TYPES.map((type) => type.value)),
  generatedNames: z.array(z.string()).optional(),
});

/**
 * POST /api/regenerate-name
 * Regenerates either a color name or palette name based on the palette rationale
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = RegenerateNameRequestSchema.parse(body);

    const { rationale, harmony, generatedNames = [] } = validatedData;

    // Generate new name using AI
    const generator = new PaletteGenerator();
    const newName = await generator.regenerateName({
      rationale,
      harmony,
      generatedNames
    });

    return NextResponse.json(
      {
        name: newName,
      },
      { status: 200 }
    );
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
        error: 'Failed to regenerate name',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
