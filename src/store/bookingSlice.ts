import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CabinLayoutType, Passenger, StepKey } from '../types';
import { SAMPLE_PASSENGERS } from '../data/passengerData';
import { MEAL_OPTIONS } from '../data/mealData';
import { BookingSliceState, ToastState } from './types';

export const INITIAL_STATE: BookingSliceState = {
  passengerCount: 2,
  passengersList: SAMPLE_PASSENGERS,
  activePassengerId: 'pax-1',
  activeLayout: '3-2',
  currentStep: 'flight',
  toast: null,
  isBookingConfirmed: false,
  seatAssignments: {
    '3-2': {},
    '2-3-2': {},
  },
  mealSelections: {
    'pax-1': 'meal-none',
    'pax-2': 'meal-none',
  },
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState: INITIAL_STATE,
  reducers: {
    setPassengerCount: (state, action: PayloadAction<number>) => {
      const newCount = action.payload;
      if (newCount < 1 || newCount > 6) return;

      const keptPassengerIds = new Set(
        SAMPLE_PASSENGERS.slice(0, newCount).map((p) => p.id)
      );

      const clean3_2: Record<string, string> = {};
      const clean2_3_2: Record<string, string> = {};

      Object.entries(state.seatAssignments['3-2']).forEach(([paxId, seatId]) => {
        if (keptPassengerIds.has(paxId)) clean3_2[paxId] = seatId;
      });

      Object.entries(state.seatAssignments['2-3-2']).forEach(([paxId, seatId]) => {
        if (keptPassengerIds.has(paxId)) clean2_3_2[paxId] = seatId;
      });

      state.seatAssignments['3-2'] = clean3_2;
      state.seatAssignments['2-3-2'] = clean2_3_2;

      const cleanMeals: Record<string, string> = {};
      Object.entries(state.mealSelections).forEach(([paxId, mealId]) => {
        if (keptPassengerIds.has(paxId)) cleanMeals[paxId] = mealId;
      });
      keptPassengerIds.forEach((paxId) => {
        if (!cleanMeals[paxId]) {
          cleanMeals[paxId] = 'meal-none';
        }
      });
      state.mealSelections = cleanMeals;

      if (!keptPassengerIds.has(state.activePassengerId)) {
        state.activePassengerId = 'pax-1';
      }

      state.passengerCount = newCount;
      state.toast = {
        message: `Updated to ${newCount} passenger${newCount > 1 ? 's' : ''}`,
        type: 'info',
        id: Date.now(),
      };
    },

    setActivePassengerId: (state, action: PayloadAction<string>) => {
      const valid = state.passengersList.slice(0, state.passengerCount);
      const exists = valid.some((p) => p.id === action.payload);
      if (exists) {
        state.activePassengerId = action.payload;
      }
    },

    setActiveLayout: (state, action: PayloadAction<CabinLayoutType>) => {
      const layout = action.payload;
      if (layout === state.activeLayout) return;
      state.activeLayout = layout;
      state.toast = {
        message: `Switched to ${layout === '3-2' ? '3–2 Single Aisle' : '2–3–2 Twin Aisle'}`,
        type: 'info',
        id: Date.now(),
      };
    },

    setCurrentStep: (state, action: PayloadAction<StepKey>) => {
      state.currentStep = action.payload;
    },

    assignSeatDirect: (
      state,
      action: PayloadAction<{
        passengerId: string;
        seatId: string;
        layout?: CabinLayoutType;
        message?: string;
      }>
    ) => {
      const layout = action.payload.layout || state.activeLayout;
      state.seatAssignments[layout][action.payload.passengerId] = action.payload.seatId;
      if (action.payload.message) {
        state.toast = {
          message: action.payload.message,
          type: 'success',
          id: Date.now(),
        };
      }
    },

    removeSeatDirect: (
      state,
      action: PayloadAction<{
        passengerId: string;
        layout?: CabinLayoutType;
        message?: string;
      }>
    ) => {
      const layout = action.payload.layout || state.activeLayout;
      delete state.seatAssignments[layout][action.payload.passengerId];
      if (action.payload.message) {
        state.toast = {
          message: action.payload.message,
          type: 'info',
          id: Date.now(),
        };
      }
    },

    selectMeal: (
      state,
      action: PayloadAction<{
        mealId: string;
        passengerId?: string;
      }>
    ) => {
      const paxId = action.payload.passengerId || state.activePassengerId;
      state.mealSelections[paxId] = action.payload.mealId;

      const valid = state.passengersList.slice(0, state.passengerCount);
      const pax = valid.find((p) => p.id === paxId);
      const meal = MEAL_OPTIONS.find((m) => m.id === action.payload.mealId) || MEAL_OPTIONS[0];
      const priceText = meal.price === 0 ? 'Free' : `₹${meal.price}`;

      state.toast = {
        message: `Selected ${meal.name} (${priceText}) for ${pax?.name || 'passenger'}`,
        type: 'success',
        id: Date.now(),
      };
    },

    updatePassengerName: (
      state,
      action: PayloadAction<{
        passengerId: string;
        newName: string;
      }>
    ) => {
      const trimmed = action.payload.newName.trim();
      if (!trimmed) {
        state.toast = {
          message: 'Passenger name cannot be empty',
          type: 'warning',
          id: Date.now(),
        };
        return;
      }

      state.passengersList = state.passengersList.map((p) =>
        p.id === action.payload.passengerId ? { ...p, name: trimmed } : p
      );

      state.toast = {
        message: `Updated name to ${trimmed}`,
        type: 'success',
        id: Date.now(),
      };
    },

    removePassenger: (state, action: PayloadAction<string>) => {
      if (state.passengerCount <= 1) {
        state.toast = {
          message: 'At least 1 passenger is required for booking',
          type: 'warning',
          id: Date.now(),
        };
        return;
      }

      const passengerId = action.payload;
      const valid = state.passengersList.slice(0, state.passengerCount);
      const paxToRemove = valid.find((p) => p.id === passengerId);
      const newCount = state.passengerCount - 1;

      const remaining = state.passengersList.filter((p) => p.id !== passengerId);
      if (paxToRemove) {
        remaining.push(paxToRemove);
      }

      state.passengersList = remaining;
      state.passengerCount = newCount;

      delete state.seatAssignments['3-2'][passengerId];
      delete state.seatAssignments['2-3-2'][passengerId];
      delete state.mealSelections[passengerId];

      if (state.activePassengerId === passengerId) {
        state.activePassengerId = remaining[0].id;
      }

      state.toast = {
        message: `Removed ${paxToRemove?.name || 'traveler'} from booking`,
        type: 'info',
        id: Date.now(),
      };
    },

    resetBooking: (state) => {
      state.isBookingConfirmed = false;
      state.passengersList = SAMPLE_PASSENGERS;
      state.passengerCount = 2;
      state.activePassengerId = 'pax-1';
      state.activeLayout = '3-2';
      state.currentStep = 'flight';
      state.seatAssignments = {
        '3-2': {},
        '2-3-2': {},
      };
      state.mealSelections = {
        'pax-1': 'meal-none',
        'pax-2': 'meal-none',
      };
      state.toast = {
        message: 'Reset all selections to default',
        type: 'info',
        id: Date.now(),
      };
    },

    confirmBooking: (state) => {
      state.isBookingConfirmed = true;
      state.toast = {
        message: 'Seat selection confirmed successfully!',
        type: 'success',
        id: Date.now(),
      };
    },

    dismissConfirmation: (state) => {
      state.isBookingConfirmed = false;
    },

    hydrateState: (state, action: PayloadAction<Partial<BookingSliceState>>) => {
      return {
        ...state,
        ...action.payload,
        toast: null,
      };
    },

    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type?: 'info' | 'success' | 'warning';
      }>
    ) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'info',
        id: Date.now(),
      };
    },

    hideToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  setPassengerCount,
  setActivePassengerId,
  setActiveLayout,
  setCurrentStep,
  assignSeatDirect,
  removeSeatDirect,
  selectMeal,
  updatePassengerName,
  removePassenger,
  resetBooking,
  confirmBooking,
  dismissConfirmation,
  hydrateState,
  showToast,
  hideToast,
} = bookingSlice.actions;

export default bookingSlice.reducer;
