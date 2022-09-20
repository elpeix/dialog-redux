import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import dialogsReducer from '../features/dialogCanvas/dialogsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    dialogs: dialogsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
