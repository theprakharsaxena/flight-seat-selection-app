export type CabinLayoutType = '3-2' | '2-3-2';

export type SeatCategory = 'standard' | 'premium' | 'extra_legroom';

export type SeatStatus =
  | 'available'
  | 'free'
  | 'occupied'
  | 'selected_active'
  | 'assigned_other';

export interface SeatDefinition {
  id: string; // e.g., '1A'
  row: number;
  col: string; // 'A', 'B', etc.
  category: SeatCategory;
  price: number;
  isOccupied: boolean;
  features?: string[]; // e.g. ['Window', 'Extra Legroom', 'Exit Row']
}

export interface Passenger {
  id: string;
  name: string;
  code: string; // e.g., 'PAX-1'
  avatarColor: string;
}

export interface MealOption {
  id: string;
  name: string;
  description: string;
  price: number;
  isVegetarian: boolean;
  dietaryTag?: string;
}

export interface FlightInfo {
  airline: string;
  flightNumber: string;
  aircraftType: string;
  origin: {
    code: string;
    city: string;
    airport: string;
    terminal: string;
  };
  destination: {
    code: string;
    city: string;
    airport: string;
    terminal: string;
  };
  departureTime: string;
  arrivalTime: string;
  date: string;
  duration: string;
  cabinClass: string;
  gate: string;
  boardingTime: string;
}

export type StepKey = 'flight' | 'passengers' | 'seats' | 'meals' | 'summary';

export interface BookingState {
  flight: FlightInfo;
  passengerCount: number;
  passengers: Passenger[];
  activePassengerId: string;
  activeLayout: CabinLayoutType;
  // Separate seat assignments preserved per layout
  seatAssignments: {
    '3-2': Record<string, string>; // passengerId -> seatId
    '2-3-2': Record<string, string>; // passengerId -> seatId
  };
  // Meal selections: passengerId -> mealId
  mealSelections: Record<string, string>;
}

