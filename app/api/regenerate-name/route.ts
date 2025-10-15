import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PaletteGenerator } from '@/lib/ai/palette-generator';
import { DEFAULT_COLOR_COUNT } from '@/constant';

/**
 * Request validation schema for name regeneration
 */
const RegenerateNameRequestSchema = z.object({
  type: z.enum(['color', 'palette']),
  rationale: z.string().min(10, 'Rationale must be at least 10 characters'),
  // For color names
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color format')
    .optional(),
  existingNames: z.array(z.string()).optional(),
  // For palette names
  colorCount: z.number().min(3).max(8).optional(),
  harmony: z.string().optional(),
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

    const { type, rationale, color, existingNames, colorCount = DEFAULT_COLOR_COUNT, harmony } = validatedData;

    // Validate required fields based on type
    if (type === 'color' && !color) {
      return NextResponse.json({ error: 'Color hex is required for color name regeneration' }, { status: 400 });
    }

    if (type === 'palette' && !harmony) {
      return NextResponse.json({ error: 'Harmony is required for palette name regeneration' }, { status: 400 });
    }

    // Generate new name using AI
    const generator = new PaletteGenerator();
    const newName = await generator.regenerateName({
      type,
      rationale,
      color: type === 'color' ? color : undefined,
      existingNames: existingNames ?? [],
      colorCount: type === 'palette' ? colorCount : undefined,
      harmony: type === 'palette' ? harmony : undefined,
    });

    return NextResponse.json(
      {
        name: newName,
        type,
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
