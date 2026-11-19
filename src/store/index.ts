import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import bookingReducer from './bookingSlice';
import { loadInitialPersistedState, persistState } from './persistence';

// Preload persisted state (synchronous on web for instant zero-flicker rehydration)
const preloadedBookingState = loadInitialPersistedState();

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
  },
  preloadedState: {
    booking: preloadedBookingState,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Automatically persist booking state whenever state updates
let previousBookingState = store.getState().booking;
store.subscribe(() => {
  const currentBookingState = store.getState().booking;
  if (currentBookingState !== previousBookingState) {
    previousBookingState = currentBookingState;
    persistState(currentBookingState);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export * from './bookingSlice';
export * from './bookingSelectors';
export * from './persistence';
export * from './types';
