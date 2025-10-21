export interface GeneratePaletteRequest {
  prompt: string;
  harmony: string;
  colorCount: number;
}

export interface GeneratePaletteNameRequest {
  rationale: string;
  harmony: string;
  generatedNames?: string[];
}

export interface Color {
  color: string;
  name: string;
}

export interface Metadata {
  prompt: string;
  harmony: string;
  rationale: string;
  tags: string[];
  generatedAt: Date;
}

export interface GeneratePaletteResponse {
  id: string;
  paletteName: string;
  colors: Color[];
  metadata: Metadata;
}

export interface GeneratePaletteNameResponse {
  name: string;
}
