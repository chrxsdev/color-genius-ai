import { configureStore } from '@reduxjs/toolkit';
import { paletteApi } from './api/paletteApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [paletteApi.reducerPath]: paletteApi.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (gDM) => gDM().concat(paletteApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];