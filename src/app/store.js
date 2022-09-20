import { configureStore } from '@reduxjs/toolkit';
import dialogsReducer from '../features/dialogCanvas/dialogsSlice';

export const store = configureStore({
  reducer: {
    dialogs: dialogsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
