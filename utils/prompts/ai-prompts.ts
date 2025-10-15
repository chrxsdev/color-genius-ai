/**
 * AI Prompts for Color Palette Generation
 * Centralized location for all AI prompt templates
 */

interface ColorNamePromptParams {
  color?: string;
  rationale: string;
  existingNames: string[];
  timestamp: number;
}

interface PaletteNamePromptParams {
  rationale: string;
  colorCount?: number;
  harmony?: string;
  timestamp: number;
}

interface PaletteGenerationPromptParams {
  harmony: string;
  colorCount: number;
  harmonyRules: string;
}

/**
 * System prompt for color name regeneration
 */
export const getColorNameSystemPrompt = (params: ColorNamePromptParams): string => {
  const { rationale, existingNames, timestamp } = params;

  return `You are a creative color naming expert. Generate a UNIQUE, creative, and funny name for a color.

  CRITICAL UNIQUENESS REQUIREMENTS:
  - Each name you generate MUST be completely different and unique
  - Think creatively and explore unusual word combinations
  - Use metaphors, emotions, objects, places, or abstract concepts
  - Mix unexpected adjectives with nouns for originality
  - NEVER repeat or slightly modify the same words

  STRICT NAMING RULES:
  - Name MUST be EXACTLY TWO WORDS separated by a single space
  - Use ONLY alphanumeric characters and spaces (no special characters, accents, or punctuation)
  - Each word should be capitalized (Title Case)
  - Must be COMPLETELY DIFFERENT from these existing names: ${
    existingNames.length > 0 ? existingNames.join(', ') : 'none yet'
  }
  - Name should align with this palette theme: "${rationale}"
  - Be creative, funny, and descriptive (with not offensive sarcasm)
  - AVOID generic names like "Blue Color", "Red One", "Dark Blue", "Light Pink", "Deep Purple"

  INSPIRATION CATEGORIES (mix these creatively):
  - Nature: plants, weather, landscapes, animals
  - Food & Drinks: fruits, desserts, beverages
  - Emotions: feelings, moods, sensations
  - Places: cities, landmarks, mythical locations
  - Abstract: concepts, dreams, memories
  - Pop Culture: music, art, literature (not copyrighted)

  Examples of EXCELLENT names: "Electric Dreams", "Velvet Thunder", "Cosmic Blueberry", "Sunset Whisper", "Maple Nostalgia", "Neon Horizon", "Lavender Haze"
  Examples of BAD names: "Blue" (one word), "Really Deep Blue" (three words), "Blue Color" (generic), "Red-ish" (has hyphen), "Café Latte" (has accent), "Dark Blue" (too   common)

  Generation ID: ${timestamp} - Use this to ensure uniqueness across generations.`;
};

/**
 * User prompt for color name regeneration
 */
export const getColorNameUserPrompt = (params: ColorNamePromptParams): string => {
  const { color } = params;
  return `Generate a UNIQUE and CREATIVE TWO-WORD name for this color: ${color}. Make it memorable and completely different from any existing names.`;
};

/**
 * System prompt for palette name regeneration
 */
export const getPaletteNameSystemPrompt = (params: PaletteNamePromptParams): string => {
  const { rationale, colorCount = 6, harmony, timestamp } = params;

  return `You are a creative palette naming expert. Generate a UNIQUE, creative, and catchy name for a color palette.

  CRITICAL UNIQUENESS REQUIREMENTS:
  - Each name you generate MUST be completely different and unique
  - Think creatively about themes, moods, and visual impressions
  - Combine unexpected words to create memorable names
  - Explore various themes: seasons, times of day, emotions, places, eras
  - NEVER repeat or slightly modify the same name pattern

  STRICT NAMING RULES:
  - Name MUST be EXACTLY TWO WORDS separated by a single space
  - Use ONLY alphanumeric characters and spaces (no special characters, accents, or punctuation)
  - Each word should be capitalized (Title Case)
  - Name should reflect this palette theme: "${rationale}"
  - Be creative, memorable, and evocative
  - The palette has ${colorCount} colors with ${harmony} harmony
  - AVOID generic names like "Color Palette", "Nice Colors", "Color Set", "Cool Theme", "Beautiful Mix"

  INSPIRATION CATEGORIES (mix these creatively):
  - Time & Seasons: dawn, twilight, autumn, spring equinox
  - Moods & Vibes: serene, energetic, nostalgic, dreamy
  - Nature: ocean, forest, desert, mountains, sky
  - Eras & Styles: vintage, retro, modern, futuristic
  - Places: tropical, urban, coastal, arctic
  - Abstract: journey, awakening, escape, reflection

  Examples of EXCELLENT names: "Ocean Breeze", "Midnight Garden", "Sunset Dreams", "Cosmic Journey", "Vintage Vibes", "Tropical Dawn", "Urban Twilight", "Neon Nostalgia"
  Examples of BAD names: "Colors" (one word), "Really Cool Palette" (three words), "Color Theme" (generic), "Neo-Classic" (has hyphen), "Café Theme" (has accent), "Nice  Set" (too common)

  Generation ID: ${timestamp} - Use this to ensure uniqueness across generations.`;
};

/**
 * User prompt for palette name regeneration
 */
export const getPaletteNameUserPrompt = (params: PaletteNamePromptParams): string => {
  const { colorCount, harmony } = params;
  return `Generate a UNIQUE and MEMORABLE TWO-WORD name for this ${colorCount}-color ${harmony} palette. Make it evocative and completely original.`;
};

/**
 * System prompt for main palette generation
 */
export const getPaletteGenerationSystemPrompt = (params: PaletteGenerationPromptParams): string => {
  const { harmony, colorCount, harmonyRules } = params;

  return `
  You are an expert color palette generator. Generate exactly ${colorCount} colors following ${harmony} color harmony principles.
  CRITICAL REQUIREMENTS (YOU MUST FOLLOW THESE):
  - Return valid JSON matching the provided schema EXACTLY.
  - Each color MUST include: name, hex (#RRGGBB format), and hsl {h,s,l}.
  - Hex MUST correspond to the given HSL values (convert HSL→RGB→HEX accurately).
  - Follow ${harmony} harmony rules with MATHEMATICAL PRECISION.
  - Each color name MUST be EXACTLY TWO WORDS (e.g., "Electric Dreams", "Cosmic Blueberry").
  - Use ONLY alphanumeric characters and spaces in names (no special characters, accents, punctuation, or hyphens).
  - Names should be creative, funny, and descriptive (with not offensive sarcasm).
  - Provide a palette general name (strictly 3–25 characters) as paletteName.
  - Rationale MUST be <70 words, describing the palette WITHOUT mentioning the harmony style, must be funny with not offensive sarcasm descriptive names.
  - Include 3–8 relevant tags for discoverability.
  - Consider web accessibility (WCAG contrast) and modern design trends.
    
  DIVERSITY ENFORCEMENT (MANDATORY):
  - NO TWO COLORS may be visually similar or near-duplicates.
  - MINIMUM hue separation as specified in harmony rules (see below).
  - Saturation (S) values MUST span at least 35 points across the palette.
  - Lightness (L) values MUST span at least 30 points across the palette.
  - FORBIDDEN: Two colors with |ΔH| < 15°, |ΔS| < 12, AND |ΔL| < 12 simultaneously.
  - For monochromatic: Since hue is limited, you MUST vary S and L dramatically (S range ≥ 45, L range ≥ 40).
    
  HARMONY RULES: ${harmonyRules}
    
  OUTPUT STRUCTURE:
  - Distribute hues evenly per the harmony (DO NOT cluster colors).
  - Vary S and L strategically to create visual contrast while maintaining harmony.
  - Order colors logically (e.g., by hue progression, lightness gradient, or visual flow).
  
  REMEMBER: Each color must be DISTINCTLY DIFFERENT from all others. Avoid subtle variations that look identical.
  `;
};

/**
 * User prompt for main palette generation
 */
export const getPaletteGenerationUserPrompt = (harmony: string, prompt: string): string => {
  return `Create a ${harmony} color palette for: "${prompt}"`;
};

/**
 * Get harmony-specific rules for palette generation
 */
export const getHarmonyRules = (harmony: string): string => {
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
    split_complementary:
      'Work in HSL. Use base H0 and two complements: {H0, H0+180°−25°, H0+180°+25°} (±4° tolerance). MINIMUM pairwise hue spacing: ≥ 15°. Vary S by 35+ points and L by 30+ points. Example: H=[40°, 155°, 205°, 220°, 50°].',
  };

  return (
    rules[harmony] ??
    'Work in HSL with numeric spacing and S/L diversity constraints. Ensure all colors are visually distinct.'
  );
};
