import { toPng } from 'html-to-image';

interface ExportToPngOptions {
  fileName?: string;
  backgroundColor?: string;
  pixelRatio?: number;
  cacheBust?: boolean;
}

/**
 * Exports an HTML element to a PNG file
 * @param element - The HTML element to export
 * @param options - Optional configuration for the export
 * @returns Promise that resolves when the download is complete
 */
export const exportElementToPng = async (
  element: HTMLElement,
  options: ExportToPngOptions = {}
): Promise<void> => {
  const {
    fileName = `export_${new Date().getTime().toString()}.png`,
    backgroundColor = '#1a1c19',
    pixelRatio = 2,
    cacheBust = true,
  } = options;

  const dataUrl = await toPng(element, {
    cacheBust,
    pixelRatio,
    style: {
      backgroundColor,
    },
  });

  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
};

/**
 * Exports a palette card to PNG
 * @param paletteId - The ID of the palette to export
 * @param paletteName - The name of the palette (used for filename)
 * @returns Promise that resolves when the download is complete
 */
export const exportPaletteCardToPng = async (
  paletteId: string,
  paletteName: string
): Promise<void> => {
  const element = document.getElementById(paletteId);
  
  if (!element) {
    console.error(`Element with id ${paletteId} not found`);
    return;
  }

  await exportElementToPng(element, {
    fileName: `${paletteName}_${new Date().getTime().toString()}.png`,
  });
};
