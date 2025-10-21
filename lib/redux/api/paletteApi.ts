import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  GeneratePaletteNameRequest,
  GeneratePaletteNameResponse,
  GeneratePaletteRequest,
  GeneratePaletteResponse,
} from '@/infrastructure/interfaces/palette-api.interface';

export const paletteApi = createApi({
  reducerPath: 'paletteApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['pallete'],
  endpoints: (builder) => ({
    generatePalette: builder.mutation<GeneratePaletteResponse, GeneratePaletteRequest>({
      query: (body) => ({
        url: '/generate-palette',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['pallete'],
    }),

    regenerateName: builder.mutation<GeneratePaletteNameResponse, GeneratePaletteNameRequest>({
      query: (body) => ({
        url: '/regenerate-name',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['pallete'],
    }),
  }),
});

export const { useGeneratePaletteMutation, useRegenerateNameMutation } = paletteApi;
