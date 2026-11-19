import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { BookingSliceState } from './types';
import { INITIAL_STATE } from './bookingSlice';

export const PERSISTENCE_STORAGE_KEY = 'FLIGHT_APP_BOOKING_STATE_V1';

/**
 * Synchronous state loader for Web.
 * Returns persisted state immediately on browser reload to prevent visual flicker.
 */
export const loadInitialPersistedState = (): BookingSliceState => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const serialized = window.localStorage.getItem(PERSISTENCE_STORAGE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        return {
          ...INITIAL_STATE,
          ...parsed,
          toast: null, // do not restore old transient toasts
        };
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
  }
  return INITIAL_STATE;
};

/**
 * Persists booking state across Web (localStorage) and Native (AsyncStorage).
 */
export const persistState = async (state: BookingSliceState): Promise<void> => {
  const dataToSave = {
    passengerCount: state.passengerCount,
    passengersList: state.passengersList,
    activePassengerId: state.activePassengerId,
    activeLayout: state.activeLayout,
    currentStep: state.currentStep,
    isBookingConfirmed: state.isBookingConfirmed,
    seatAssignments: state.seatAssignments,
    mealSelections: state.mealSelections,
  };

  const serialized = JSON.stringify(dataToSave);

  // Web persistence
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(PERSISTENCE_STORAGE_KEY, serialized);
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  // Native persistence (AsyncStorage)
  try {
    await AsyncStorage.setItem(PERSISTENCE_STORAGE_KEY, serialized);
  } catch (e) {
    // Ignore in environments without AsyncStorage
  }
};

/**
 * Asynchronously rehydrates state on native iOS/Android devices.
 */
export const rehydrateNativeState = async (
  dispatch: (action: any) => void,
  hydrateActionCreator: (payload: Partial<BookingSliceState>) => any
): Promise<void> => {
  if (Platform.OS !== 'web') {
    try {
      const serialized = await AsyncStorage.getItem(PERSISTENCE_STORAGE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        dispatch(hydrateActionCreator(parsed));
      }
    } catch (e) {
      console.warn('Failed to rehydrate from AsyncStorage:', e);
    }
  }
};

/**
 * Clears persisted state from both storages.
 */
export const clearPersistedState = async (): Promise<void> => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(PERSISTENCE_STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }
  try {
    await AsyncStorage.removeItem(PERSISTENCE_STORAGE_KEY);
  } catch (e) {
    // Ignore
  }
};
