import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import {
  BookingState,
  CabinLayoutType,
  FlightInfo,
  MealOption,
  Passenger,
  SeatDefinition,
  StepKey,
} from '../types';
import { MOCK_FLIGHT } from '../data/flightData';
import { SAMPLE_PASSENGERS } from '../data/passengerData';
import { MEAL_OPTIONS } from '../data/mealData';
import { SEAT_MAP_BY_LAYOUT } from '../data/seatData';

export interface PassengerSummary {
  passenger: Passenger;
  seat: SeatDefinition | null;
  seatPrice: number;
  meal: MealOption;
  mealPrice: number;
  totalPassengerCost: number;
}

export interface ToastState {
  message: string;
  type: 'info' | 'success' | 'warning';
  id: number;
}

interface BookingContextType {
  // State
  state: BookingState;
  currentStep: StepKey;
  activePassenger: Passenger;
  validPassengers: Passenger[];
  activeMealOption: MealOption;
  toast: ToastState | null;

  // Actions
  setCurrentStep: (step: StepKey) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPassengerCount: (count: number) => void;
  setActivePassengerId: (id: string) => void;
  setActiveLayout: (layout: CabinLayoutType) => void;
  selectSeat: (seatId: string) => { success: boolean; message: string };
  removeSeat: (passengerId?: string) => void;
  selectMeal: (mealId: string, passengerId?: string) => void;
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

const STEP_ORDER: StepKey[] = ['flight', 'passengers', 'seats', 'meals', 'summary'];

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [passengerCount, setPassengerCountState] = useState<number>(2);
  const [activePassengerId, setActivePassengerIdState] = useState<string>('pax-1');
  const [activeLayout, setActiveLayoutState] = useState<CabinLayoutType>('3-2');
  const [currentStep, setCurrentStep] = useState<StepKey>('flight');
  const [toast, setToast] = useState<ToastState | null>(null);

  // Independent seat assignments for each layout
  const [seatAssignments, setSeatAssignments] = useState<{
    '3-2': Record<string, string>;
    '2-3-2': Record<string, string>;
  }>({
    '3-2': {},
    '2-3-2': {},
  });

  // Meal selections: passengerId -> mealId (defaults to 'meal-none')
  const [mealSelections, setMealSelections] = useState<Record<string, string>>({
    'pax-1': 'meal-none',
    'pax-2': 'meal-none',
  });

  const validPassengers = useMemo(() => {
    return SAMPLE_PASSENGERS.slice(0, passengerCount);
  }, [passengerCount]);

  const activePassenger = useMemo(() => {
    const found = validPassengers.find((p) => p.id === activePassengerId);
    return found || validPassengers[0];
  }, [validPassengers, activePassengerId]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  const hideToast = () => {
    setToast(null);
  };

  const setPassengerCount = (newCount: number) => {
    if (newCount < 1 || newCount > 6) return;
    
    // When count reduces: clear assignments and meals of removed passengers
    const keptPassengerIds = new Set(SAMPLE_PASSENGERS.slice(0, newCount).map((p) => p.id));

    setSeatAssignments((prev) => {
      const clean3_2: Record<string, string> = {};
      const clean2_3_2: Record<string, string> = {};

      Object.entries(prev['3-2']).forEach(([paxId, seatId]) => {
        if (keptPassengerIds.has(paxId)) clean3_2[paxId] = seatId;
      });

      Object.entries(prev['2-3-2']).forEach(([paxId, seatId]) => {
        if (keptPassengerIds.has(paxId)) clean2_3_2[paxId] = seatId;
      });

      return {
        '3-2': clean3_2,
        '2-3-2': clean2_3_2,
      };
    });

    setMealSelections((prev) => {
      const cleanMeals: Record<string, string> = {};
      Object.entries(prev).forEach(([paxId, mealId]) => {
        if (keptPassengerIds.has(paxId)) cleanMeals[paxId] = mealId;
      });
      // Initialize any newly added passengers with default 'meal-none'
      keptPassengerIds.forEach((paxId) => {
        if (!cleanMeals[paxId]) {
          cleanMeals[paxId] = 'meal-none';
        }
      });
      return cleanMeals;
    });

    // Reset active passenger if the previous one is no longer valid
    if (!keptPassengerIds.has(activePassengerId)) {
      setActivePassengerIdState('pax-1');
    }

    setPassengerCountState(newCount);
    showToast(`Updated to ${newCount} passenger${newCount > 1 ? 's' : ''}`, 'info');
  };

  const setActivePassengerId = (id: string) => {
    const exists = validPassengers.some((p) => p.id === id);
    if (exists) {
      setActivePassengerIdState(id);
    }
  };

  const setActiveLayout = (layout: CabinLayoutType) => {
    if (layout === activeLayout) return;
    setActiveLayoutState(layout);
    showToast(`Switched to ${layout === '3-2' ? '3–2 Single Aisle' : '2–3–2 Twin Aisle'}`, 'info');
  };

  // Helper to get assigned seat for passenger in specified (or active) layout
  const getSeatForPassenger = (passengerId: string, layout: CabinLayoutType = activeLayout): SeatDefinition | null => {
    const seatId = seatAssignments[layout][passengerId];
    if (!seatId) return null;
    return SEAT_MAP_BY_LAYOUT[layout].get(seatId) || null;
  };

  // Helper to find which passenger holds a seat in specified (or active) layout
  const getPassengerForSeat = (seatId: string, layout: CabinLayoutType = activeLayout): Passenger | null => {
    const entries = Object.entries(seatAssignments[layout]);
    const match = entries.find(([_, sId]) => sId === seatId);
    if (!match) return null;
    return SAMPLE_PASSENGERS.find((p) => p.id === match[0]) || null;
  };

  // Seat selection action
  const selectSeat = (seatId: string): { success: boolean; message: string } => {
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
      setSeatAssignments((prev) => {
        const updated = { ...prev[activeLayout] };
        delete updated[activePassenger.id];
        return {
          ...prev,
          [activeLayout]: updated,
        };
      });
      const msg = `Removed seat ${seatId} for ${activePassenger.name}`;
      showToast(msg, 'info');
      return { success: true, message: msg };
    }

    // Rule: seat assigned to another passenger in current booking cannot be selected
    const assignedOtherPax = getPassengerForSeat(seatId, activeLayout);
    if (assignedOtherPax && assignedOtherPax.id !== activePassenger.id) {
      const msg = `Seat ${seatId} is already assigned to ${assignedOtherPax.name}`;
      showToast(msg, 'warning');
      return { success: false, message: msg };
    }

    // Assign seat to active passenger (replaces previous seat if any)
    setSeatAssignments((prev) => {
      const updated = { ...prev[activeLayout] };
      updated[activePassenger.id] = seatId;
      return {
        ...prev,
        [activeLayout]: updated,
      };
    });

    const priceText = seat.price === 0 ? 'Free' : `₹${seat.price}`;
    const msg = `Assigned ${seatId} (${seat.category === 'extra_legroom' ? 'Extra Legroom' : seat.category === 'premium' ? 'Premium' : 'Standard'} • ${priceText}) to ${activePassenger.name}`;
    showToast(msg, 'success');

    // Auto-advance to next passenger if more passengers still need seats
    const nextUnassignedPax = validPassengers.find(
      (p) => p.id !== activePassenger.id && !seatAssignments[activeLayout][p.id]
    );
    if (nextUnassignedPax) {
      setActivePassengerIdState(nextUnassignedPax.id);
    }

    return { success: true, message: msg };
  };

  const removeSeat = (passengerId: string = activePassenger.id) => {
    const seatId = seatAssignments[activeLayout][passengerId];
    if (!seatId) return;

    setSeatAssignments((prev) => {
      const updated = { ...prev[activeLayout] };
      delete updated[passengerId];
      return {
        ...prev,
        [activeLayout]: updated,
      };
    });

    const pax = validPassengers.find((p) => p.id === passengerId);
    showToast(`Cleared seat assignment for ${pax?.name || 'passenger'}`, 'info');
  };

  // Meal selection action
  const selectMeal = (mealId: string, passengerId: string = activePassenger.id) => {
    const meal = MEAL_OPTIONS.find((m) => m.id === mealId) || MEAL_OPTIONS[0];

    setMealSelections((prev) => ({
      ...prev,
      [passengerId]: mealId,
    }));

    const pax = validPassengers.find((p) => p.id === passengerId);
    const priceText = meal.price === 0 ? 'Free' : `₹${meal.price}`;
    showToast(`Selected ${meal.name} (${priceText}) for ${pax?.name || 'passenger'}`, 'success');

    // Optional auto-switch to next passenger without meal selection
    const nextPaxWithoutMeal = validPassengers.find(
      (p) => p.id !== passengerId && (!mealSelections[p.id] || mealSelections[p.id] === 'meal-none')
    );
    if (nextPaxWithoutMeal && mealId !== 'meal-none') {
      setActivePassengerIdState(nextPaxWithoutMeal.id);
    }
  };

  const activeMealOption = useMemo(() => {
    const mealId = mealSelections[activePassenger.id] || 'meal-none';
    return MEAL_OPTIONS.find((m) => m.id === mealId) || MEAL_OPTIONS[0];
  }, [mealSelections, activePassenger.id]);

  // Passenger summaries with dynamic pricing
  const passengerSummaries: PassengerSummary[] = useMemo(() => {
    return validPassengers.map((passenger) => {
      const seat = getSeatForPassenger(passenger.id, activeLayout);
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
  }, [validPassengers, seatAssignments, activeLayout, mealSelections]);

  const totalSeatCharges = useMemo(() => {
    return passengerSummaries.reduce((sum, item) => sum + item.seatPrice, 0);
  }, [passengerSummaries]);

  const totalMealCharges = useMemo(() => {
    return passengerSummaries.reduce((sum, item) => sum + item.mealPrice, 0);
  }, [passengerSummaries]);

  const totalAmount = useMemo(() => {
    return totalSeatCharges + totalMealCharges;
  }, [totalSeatCharges, totalMealCharges]);

  // Stepper navigation
  const nextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  };

  const state: BookingState = {
    flight: MOCK_FLIGHT,
    passengerCount,
    passengers: validPassengers,
    activePassengerId,
    activeLayout,
    seatAssignments,
    mealSelections,
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        currentStep,
        activePassenger,
        validPassengers,
        activeMealOption,
        toast,
        setCurrentStep,
        nextStep,
        prevStep,
        setPassengerCount,
        setActivePassengerId,
        setActiveLayout,
        selectSeat,
        removeSeat,
        selectMeal,
        showToast,
        hideToast,
        passengerSummaries,
        totalSeatCharges,
        totalMealCharges,
        totalAmount,
        getSeatForPassenger,
        getPassengerForSeat,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

