import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import {
  CabinLayoutType,
  MealOption,
  Passenger,
  SeatDefinition,
  StepKey,
} from '../types';
import { MEAL_OPTIONS } from '../data/mealData';
import { SEAT_MAP_BY_LAYOUT } from '../data/seatData';
import { SAMPLE_PASSENGERS } from '../data/passengerData';
import { PassengerSummary } from './types';

export const STEP_ORDER: StepKey[] = ['flight', 'passengers', 'seats', 'meals', 'summary'];

export const selectBookingState = (state: RootState) => state.booking;

export const selectPassengerCount = (state: RootState) => state.booking.passengerCount;
export const selectPassengersList = (state: RootState) => state.booking.passengersList;
export const selectActivePassengerId = (state: RootState) => state.booking.activePassengerId;
export const selectActiveLayout = (state: RootState) => state.booking.activeLayout;
export const selectCurrentStep = (state: RootState) => state.booking.currentStep;
export const selectToast = (state: RootState) => state.booking.toast;
export const selectIsBookingConfirmed = (state: RootState) => state.booking.isBookingConfirmed;
export const selectSeatAssignments = (state: RootState) => state.booking.seatAssignments;
export const selectMealSelections = (state: RootState) => state.booking.mealSelections;

export const selectValidPassengers = createSelector(
  [selectPassengersList, selectPassengerCount],
  (passengersList, count): Passenger[] => {
    return passengersList.slice(0, count);
  }
);

export const selectActivePassenger = createSelector(
  [selectValidPassengers, selectActivePassengerId],
  (validPassengers, activeId): Passenger => {
    const found = validPassengers.find((p) => p.id === activeId);
    return found || validPassengers[0];
  }
);

export const selectActiveMealOption = createSelector(
  [selectMealSelections, selectActivePassenger],
  (mealSelections, activePassenger): MealOption => {
    const mealId = mealSelections[activePassenger.id] || 'meal-none';
    return MEAL_OPTIONS.find((m) => m.id === mealId) || MEAL_OPTIONS[0];
  }
);

export const getSeatForPassengerHelper = (
  seatAssignments: { '3-2': Record<string, string>; '2-3-2': Record<string, string> },
  passengerId: string,
  layout: CabinLayoutType
): SeatDefinition | null => {
  const seatId = seatAssignments[layout]?.[passengerId];
  if (!seatId) return null;
  return SEAT_MAP_BY_LAYOUT[layout].get(seatId) || null;
};

export const getPassengerForSeatHelper = (
  seatAssignments: { '3-2': Record<string, string>; '2-3-2': Record<string, string> },
  passengersList: Passenger[],
  seatId: string,
  layout: CabinLayoutType
): Passenger | null => {
  const entries = Object.entries(seatAssignments[layout] || {});
  const match = entries.find(([_, sId]) => sId === seatId);
  if (!match) return null;
  return (
    passengersList.find((p) => p.id === match[0]) ||
    SAMPLE_PASSENGERS.find((p) => p.id === match[0]) ||
    null
  );
};

export const selectPassengerSummaries = createSelector(
  [selectValidPassengers, selectSeatAssignments, selectActiveLayout, selectMealSelections],
  (validPassengers, seatAssignments, activeLayout, mealSelections): PassengerSummary[] => {
    return validPassengers.map((passenger) => {
      const seat = getSeatForPassengerHelper(seatAssignments, passenger.id, activeLayout);
      const seatPrice = seat ? seat.price : 0;
      const mealId = mealSelections[passenger.id] || 'meal-none';
      const meal = MEAL_OPTIONS.find((m) => m.id === mealId) || MEAL_OPTIONS[0];
      const mealPrice = meal.price;

      return {
        passenger,
        seat,
        seatPrice,
        meal,
        mealPrice,
        totalPassengerCost: seatPrice + mealPrice,
      };
    });
  }
);

export const selectTotalSeatCharges = createSelector(
  [selectPassengerSummaries],
  (summaries): number => {
    return summaries.reduce((sum, item) => sum + item.seatPrice, 0);
  }
);

export const selectTotalMealCharges = createSelector(
  [selectPassengerSummaries],
  (summaries): number => {
    return summaries.reduce((sum, item) => sum + item.mealPrice, 0);
  }
);

export const selectTotalAmount = createSelector(
  [selectTotalSeatCharges, selectTotalMealCharges],
  (seatCharges, mealCharges): number => {
    return seatCharges + mealCharges;
  }
);

export const checkCanProceedFromStep = (
  step: StepKey,
  validPassengers: Passenger[],
  activeLayout: CabinLayoutType,
  seatAssignments: { '3-2': Record<string, string>; '2-3-2': Record<string, string> },
  mealSelections: Record<string, string>
): { allowed: boolean; reason?: string; unassignedPassenger?: Passenger } => {
  switch (step) {
    case 'flight':
      return { allowed: true };
    case 'passengers': {
      if (validPassengers.length < 1) {
        return { allowed: false, reason: 'Please select at least 1 traveler' };
      }
      const emptyNamePax = validPassengers.find((p) => !p.name || p.name.trim().length === 0);
      if (emptyNamePax) {
        return { allowed: false, reason: 'Please ensure all travelers have valid names' };
      }
      return { allowed: true };
    }
    case 'seats': {
      const currentAssignments = seatAssignments[activeLayout];
      const unassigned = validPassengers.find((p) => !currentAssignments[p.id]);
      if (unassigned) {
        const assignedCount = validPassengers.filter((p) => Boolean(currentAssignments[p.id])).length;
        return {
          allowed: false,
          reason: `Please select a seat for ${unassigned.name} (${assignedCount}/${validPassengers.length} assigned)`,
          unassignedPassenger: unassigned,
        };
      }
      return { allowed: true };
    }
    case 'meals': {
      const missingMealPax = validPassengers.find((p) => !mealSelections[p.id]);
      if (missingMealPax) {
        return {
          allowed: false,
          reason: `Please select a meal preference for ${missingMealPax.name}`,
        };
      }
      return { allowed: true };
    }
    case 'summary':
      return { allowed: true };
    default:
      return { allowed: true };
  }
};

export const checkCanAccessStep = (
  targetStep: StepKey,
  validPassengers: Passenger[],
  activeLayout: CabinLayoutType,
  seatAssignments: { '3-2': Record<string, string>; '2-3-2': Record<string, string> },
  mealSelections: Record<string, string>
): { allowed: boolean; blockedStep?: StepKey; reason?: string } => {
  const targetIndex = STEP_ORDER.indexOf(targetStep);
  if (targetIndex <= 0) return { allowed: true };

  for (let i = 0; i < targetIndex; i++) {
    const stepKey = STEP_ORDER[i];
    const check = checkCanProceedFromStep(
      stepKey,
      validPassengers,
      activeLayout,
      seatAssignments,
      mealSelections
    );
    if (!check.allowed) {
      return {
        allowed: false,
        blockedStep: stepKey,
        reason: check.reason,
      };
    }
  }
  return { allowed: true };
};
