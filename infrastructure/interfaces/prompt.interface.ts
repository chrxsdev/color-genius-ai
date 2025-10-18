/**
 * AI Prompts for Color Palette Generation
 * Centralized location for all AI prompt templates
 */

export interface PaletteNamePromptParams {
  rationale: string;
  generatedNames: string[];
  harmony: string;
  timestamp: number;
}

export interface PaletteGenerationPromptParams {
  harmony: string;
  colorCount: number;
  harmonyRules: string;
}
