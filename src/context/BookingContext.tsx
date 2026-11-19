import React, { ReactNode, useCallback } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import {
  BookingState,
  CabinLayoutType,
  MealOption,
  Passenger,
  SeatDefinition,
  StepKey,
} from '../types';
import { MOCK_FLIGHT } from '../data/flightData';
import { SEAT_MAP_BY_LAYOUT } from '../data/seatData';
import {
  store,
  useAppDispatch,
  useAppSelector,
  selectBookingState,
  selectValidPassengers,
  selectActivePassenger,
  selectActiveMealOption,
  selectPassengerSummaries,
  selectTotalSeatCharges,
  selectTotalMealCharges,
  selectTotalAmount,
  getSeatForPassengerHelper,
  getPassengerForSeatHelper,
  checkCanProceedFromStep,
  checkCanAccessStep,
  STEP_ORDER,
  setPassengerCount as setPassengerCountAction,
  setActivePassengerId as setActivePassengerIdAction,
  setActiveLayout as setActiveLayoutAction,
  setCurrentStep as setCurrentStepAction,
  assignSeatDirect,
  removeSeatDirect,
  selectMeal as selectMealAction,
  updatePassengerName as updatePassengerNameAction,
  removePassenger as removePassengerAction,
  resetBooking as resetBookingAction,
  confirmBooking as confirmBookingAction,
  dismissConfirmation as dismissConfirmationAction,
  showToast as showToastAction,
  hideToast as hideToastAction,
  hydrateState,
  rehydrateNativeState,
} from '../store';
import { ToastState, PassengerSummary } from '../store/types';

export { ToastState, PassengerSummary };

export interface BookingContextType {
  // State
  state: BookingState;
  currentStep: StepKey;
  activePassenger: Passenger;
  validPassengers: Passenger[];
  activeMealOption: MealOption;
  toast: ToastState | null;

  // Actions
  setCurrentStep: (step: StepKey) => void;
  goToStep: (step: StepKey) => boolean;
  canProceedFromStep: (step: StepKey) => { allowed: boolean; reason?: string; unassignedPassenger?: Passenger };
  canAccessStep: (targetStep: StepKey) => { allowed: boolean; blockedStep?: StepKey; reason?: string };
  nextStep: () => void;
  prevStep: () => void;
  setPassengerCount: (count: number) => void;
  setActivePassengerId: (id: string) => void;
  setActiveLayout: (layout: CabinLayoutType) => void;
  selectSeat: (seatId: string) => { success: boolean; message: string };
  removeSeat: (passengerId?: string) => void;
  selectMeal: (mealId: string, passengerId?: string) => void;
  updatePassengerName: (passengerId: string, newName: string) => void;
  removePassenger: (passengerId: string) => void;
  resetBooking: () => void;
  isBookingConfirmed: boolean;
  confirmBooking: () => void;
  dismissConfirmation: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
  hideToast: () => void;

  // Calculations
  passengerSummaries: PassengerSummary[];
  totalSeatCharges: number;
  totalMealCharges: number;
  totalAmount: number;
  getSeatForPassenger: (passengerId: string, layout?: CabinLayoutType) => SeatDefinition | null;
  getPassengerForSeat: (seatId: string, layout?: CabinLayoutType) => Passenger | null;
}

const PersistenceInitializer: React.FC = () => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    rehydrateNativeState(dispatch, hydrateState);
  }, [dispatch]);
  return null;
};

/**
 * BookingProvider wraps the application in the Redux Toolkit Provider.
 */
export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <PersistenceInitializer />
      {children}
    </ReduxProvider>
  );
};

/**
 * useBooking hook connects components to the Redux Toolkit store.
 */
export const useBooking = (): BookingContextType => {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const booking = useAppSelector(selectBookingState);
  const validPassengers = useAppSelector(selectValidPassengers);
  const activePassenger = useAppSelector(selectActivePassenger);
  const activeMealOption = useAppSelector(selectActiveMealOption);
  const passengerSummaries = useAppSelector(selectPassengerSummaries);
  const totalSeatCharges = useAppSelector(selectTotalSeatCharges);
  const totalMealCharges = useAppSelector(selectTotalMealCharges);
  const totalAmount = useAppSelector(selectTotalAmount);

  const {
    currentStep,
    toast,
    isBookingConfirmed,
    passengerCount,
    activePassengerId,
    activeLayout,
    seatAssignments,
    mealSelections,
  } = booking;

  // Dispatch Actions
  const showToast = useCallback(
    (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
      dispatch(showToastAction({ message, type }));
    },
    [dispatch]
  );

  const hideToast = useCallback(() => {
    dispatch(hideToastAction());
  }, [dispatch]);

  const setPassengerCount = useCallback(
    (count: number) => {
      dispatch(setPassengerCountAction(count));
    },
    [dispatch]
  );

  const setActivePassengerId = useCallback(
    (id: string) => {
      dispatch(setActivePassengerIdAction(id));
    },
    [dispatch]
  );

  const setActiveLayout = useCallback(
    (layout: CabinLayoutType) => {
      dispatch(setActiveLayoutAction(layout));
    },
    [dispatch]
  );

  const selectMeal = useCallback(
    (mealId: string, passengerId?: string) => {
      dispatch(selectMealAction({ mealId, passengerId }));
    },
    [dispatch]
  );

  const updatePassengerName = useCallback(
    (passengerId: string, newName: string) => {
      dispatch(updatePassengerNameAction({ passengerId, newName }));
    },
    [dispatch]
  );

  const removePassenger = useCallback(
    (passengerId: string) => {
      dispatch(removePassengerAction(passengerId));
    },
    [dispatch]
  );

  const resetBooking = useCallback(() => {
    dispatch(resetBookingAction());
  }, [dispatch]);

  const confirmBooking = useCallback(() => {
    dispatch(confirmBookingAction());
  }, [dispatch]);

  const dismissConfirmation = useCallback(() => {
    dispatch(dismissConfirmationAction());
  }, [dispatch]);

  const removeSeat = useCallback(
    (passengerId: string = activePassenger.id) => {
      const seatId = seatAssignments[activeLayout][passengerId];
      if (!seatId) return;

      const pax = validPassengers.find((p) => p.id === passengerId);
      dispatch(
        removeSeatDirect({
          passengerId,
          layout: activeLayout,
          message: `Cleared seat assignment for ${pax?.name || 'passenger'}`,
        })
      );
    },
    [dispatch, seatAssignments, activeLayout, activePassenger.id, validPassengers]
  );

  const getSeatForPassenger = useCallback(
    (passengerId: string, layout: CabinLayoutType = activeLayout): SeatDefinition | null => {
      return getSeatForPassengerHelper(seatAssignments, passengerId, layout);
    },
    [seatAssignments, activeLayout]
  );

  const getPassengerForSeat = useCallback(
    (seatId: string, layout: CabinLayoutType = activeLayout): Passenger | null => {
      return getPassengerForSeatHelper(seatAssignments, booking.passengersList, seatId, layout);
    },
    [seatAssignments, booking.passengersList, activeLayout]
  );

  const selectSeat = useCallback(
    (seatId: string): { success: boolean; message: string } => {
      const seatMap = SEAT_MAP_BY_LAYOUT[activeLayout];
      const seat = seatMap.get(seatId);

      if (!seat) {
        const msg = `Seat ${seatId} not found in this layout`;
        showToast(msg, 'warning');
        return { success: false, message: msg };
      }

      // Rule: occupied seats must never be selectable
      if (seat.isOccupied) {
        const msg = `Seat ${seatId} is already occupied on this flight`;
        showToast(msg, 'warning');
        return { success: false, message: msg };
      }

      const currentSeatOfActive = seatAssignments[activeLayout][activePassenger.id];

      // If tapping the already selected seat for active passenger, remove it
      if (currentSeatOfActive === seatId) {
        const msg = `Removed seat ${seatId} for ${activePassenger.name}`;
        dispatch(
          removeSeatDirect({
            passengerId: activePassenger.id,
            layout: activeLayout,
            message: msg,
          })
        );
        return { success: true, message: msg };
      }

      // Rule: seat assigned to another passenger in current booking cannot be selected
      const assignedOtherPax = getPassengerForSeat(seatId, activeLayout);
      if (assignedOtherPax && assignedOtherPax.id !== activePassenger.id) {
        const msg = `Seat ${seatId} is already assigned to ${assignedOtherPax.name}`;
        showToast(msg, 'warning');
        return { success: false, message: msg };
      }

      // Assign seat to active passenger
      const priceText = seat.price === 0 ? 'Free' : `₹${seat.price}`;
      const categoryLabel =
        seat.category === 'extra_legroom'
          ? 'Extra Legroom'
          : seat.category === 'premium'
          ? 'Premium'
          : 'Standard';
      const msg = `Assigned ${seatId} (${categoryLabel} • ${priceText}) to ${activePassenger.name}`;

      dispatch(
        assignSeatDirect({
          passengerId: activePassenger.id,
          seatId,
          layout: activeLayout,
          message: msg,
        })
      );

      // Keep the active passenger selected (manual passenger switching via tabs only)
      return { success: true, message: msg };
    },
    [activeLayout, seatAssignments, activePassenger, getPassengerForSeat, showToast, dispatch]
  );

  const canProceedFromStep = useCallback(
    (step: StepKey) => {
      return checkCanProceedFromStep(
        step,
        validPassengers,
        activeLayout,
        seatAssignments,
        mealSelections
      );
    },
    [validPassengers, activeLayout, seatAssignments, mealSelections]
  );

  const canAccessStep = useCallback(
    (targetStep: StepKey) => {
      return checkCanAccessStep(
        targetStep,
        validPassengers,
        activeLayout,
        seatAssignments,
        mealSelections
      );
    },
    [validPassengers, activeLayout, seatAssignments, mealSelections]
  );

  const goToStep = useCallback(
    (targetStep: StepKey): boolean => {
      if (targetStep === currentStep) return true;

      const currentIndex = STEP_ORDER.indexOf(currentStep);
      const targetIndex = STEP_ORDER.indexOf(targetStep);

      // Moving backward to earlier screens is always permitted
      if (targetIndex < currentIndex) {
        dispatch(setCurrentStepAction(targetStep));
        return true;
      }

      // Moving forward: validate each intermediate step
      for (let i = 0; i < targetIndex; i++) {
        const stepKey = STEP_ORDER[i];
        const check = canProceedFromStep(stepKey);
        if (!check.allowed) {
          showToast(check.reason || 'Please complete required fields before proceeding', 'warning');
          if (check.unassignedPassenger) {
            dispatch(setActivePassengerIdAction(check.unassignedPassenger.id));
          }
          if (i > currentIndex) {
            dispatch(setCurrentStepAction(stepKey));
          }
          return false;
        }
      }

      // Default to first traveler when entering meals
      if (targetStep === 'meals' && validPassengers.length > 0) {
        dispatch(setActivePassengerIdAction(validPassengers[0].id));
      }

      dispatch(setCurrentStepAction(targetStep));
      return true;
    },
    [currentStep, canProceedFromStep, showToast, validPassengers, dispatch]
  );

  const setCurrentStep = useCallback(
    (step: StepKey) => {
      goToStep(step);
    },
    [goToStep]
  );

  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      goToStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      dispatch(setCurrentStepAction(STEP_ORDER[currentIndex - 1]));
    }
  }, [currentStep, dispatch]);

  const state: BookingState = {
    flight: MOCK_FLIGHT,
    passengerCount,
    passengers: validPassengers,
    activePassengerId,
    activeLayout,
    seatAssignments,
    mealSelections,
  };

  return {
    state,
    currentStep,
    activePassenger,
    validPassengers,
    activeMealOption,
    toast,
    setCurrentStep,
    goToStep,
    canProceedFromStep,
    canAccessStep,
    nextStep,
    prevStep,
    setPassengerCount,
    setActivePassengerId,
    setActiveLayout,
    selectSeat,
    removeSeat,
    selectMeal,
    updatePassengerName,
    removePassenger,
    resetBooking,
    isBookingConfirmed,
    confirmBooking,
    dismissConfirmation,
    showToast,
    hideToast,
    passengerSummaries,
    totalSeatCharges,
    totalMealCharges,
    totalAmount,
    getSeatForPassenger,
    getPassengerForSeat,
  };
};
