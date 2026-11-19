import {
  CabinLayoutType,
  MealOption,
  Passenger,
  SeatDefinition,
  StepKey,
} from '../types';

export interface ToastState {
  message: string;
  type: 'info' | 'success' | 'warning';
  id: number;
}

export interface PassengerSummary {
  passenger: Passenger;
  seat: SeatDefinition | null;
  seatPrice: number;
  meal: MealOption;
  mealPrice: number;
  totalPassengerCost: number;
}

export interface BookingSliceState {
  passengerCount: number;
  passengersList: Passenger[];
  activePassengerId: string;
  activeLayout: CabinLayoutType;
  currentStep: StepKey;
  toast: ToastState | null;
  isBookingConfirmed: boolean;
  seatAssignments: {
    '3-2': Record<string, string>;
    '2-3-2': Record<string, string>;
  };
  mealSelections: Record<string, string>;
}
