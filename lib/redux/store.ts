import { configureStore } from '@reduxjs/toolkit';
import { paletteReducer } from './features/palette/paletteSlice';
import { paletteApi } from './api/paletteApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      palette: paletteReducer,
      [paletteApi.reducerPath]: paletteApi.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (gDM) => gDM().concat(paletteApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];