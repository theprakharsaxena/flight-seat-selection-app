# Flight Seat Selection & Passenger Management App

A production-quality React Native application for flight seat selection, passenger roster management, meal preference ordering, and dynamic price calculation. Built with React Native, TypeScript, and Expo.

- **Live Web Deployment**: [https://flight-seat-selection-app.vercel.app/](https://flight-seat-selection-app.vercel.app/)
- **GitHub Repository**: [https://github.com/theprakharsaxena/flight-seat-selection-app](https://github.com/theprakharsaxena/flight-seat-selection-app)
- **Video Walkthroughs**:
  - **Part 1: Live App & Feature Demo**: [Google Drive Video Link](https://drive.google.com/file/d/1iQNhIYsGx3O_ZoPaNuigwOMRqmaelSFi/view?usp=sharing)
  - **Part 2: Code Architecture & Unit Tests Walkthrough**: [Google Drive Video Link](https://drive.google.com/file/d/165txjNd33ld7JglKDDk3RSydk7SYhhYz/view?usp=sharing)

---

## 1. Project Overview

This mobile application provides an end-to-end flight seat selection and passenger management workflow tailored for airline mobile booking journeys. The design prioritizes native mobile ergonomics, visual hierarchy, touch target sizing, accessibility across seat states, and predictable state synchronization.

**Important Note**: This project uses mock flight data and local application state. It does not integrate with live airline backends, GDS feeds, or actual payment gateways.

---

## 2. Key Features

- **Clean Airline UI**: Focused, realistic airline booking interface with native mobile ergonomics, intuitive seat selection, and clear visual hierarchy.
- **Dynamic Passenger Management (1 to 6 Travelers)**:
  - Stepper controls and direct numerical selector.
  - Active passenger switching.
  - Preloaded sample passenger records (`Prakhar Saxena`, `Deepak Tiwari`, `Bhoomi Jain`, `Jayesh Rajesh Tamkar`, `Ankit Gupta`, `Anjali Bhujbal`).
  - Automatic seat release and meal reset when reducing passenger count.
- **Dual Aircraft Seating Configurations**:
  - **3–2 Single Aisle Layout**: A B C | D E (5 seats per row, 14 rows).
  - **2–3–2 Twin Aisle Layout**: A B | D E F | G H (7 seats per row, 14 rows).
  - **Layout Independence**: Switching configurations preserves independent seat allocations for each layout separately.
- **Multi-State Seat Model**:
  - `Available (Paid)`: Selectable seat with explicit category/price tag.
  - `Free (₹0)`: Complimentary standard seats.
  - `Occupied`: Visually disabled, non-selectable with subtle cross indicator.
  - `Selected (Active Passenger)`: Deep navy solid highlight with white checkmark badge.
  - `Assigned (Other Passenger)`: Dashed boundary with the passenger's initials badge, preventing accidental duplicate assignments.
- **Transparent Dynamic Pricing**:
  - Standard Seats: ₹0
  - Premium Seats: ₹250
  - Extra Legroom Seats: ₹350
  - Exit row surcharge rules and front bulkhead pricing.
- **Dietary Meal Preferences (Per Passenger)**:
  - Independent meal choices for each traveler:
    - No Meal: ₹0
    - Vegetarian Meal: ₹150
    - Non-Vegetarian Meal: ₹200
    - Vegan Meal: ₹180
    - Jain Meal: ₹170
- **Itemized Booking Summary**:
  - Live cost breakdown per traveler (seat charge + meal charge).
  - Subtotals for seat selection and meals.
  - Final total calculation: `Total Amount = Total Seat Charges + Total Meal Charges`.
  - Confirmation modal with mock booking reference (`EA-784291`).

---

## 3. Technology Stack

- **Framework**: React Native 0.88 with Expo SDK 58
- **Language**: TypeScript (Strict typing)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit` & `react-redux`) with centralized store, slices, and memoized selectors
- **Styling**: React Native `StyleSheet` with consistent design tokens
- **Icons**: Lucide React Native (`lucide-react-native`, `react-native-svg`)
- **Safe Area**: `react-native-safe-area-context`
- **Testing**: Jest with `ts-jest` for business logic and edge case test coverage

---

## 4. Project Structure

```
flight-seat-selection-app/
├── __tests__/
│   └── booking.test.ts          # Jest test suite (seat logic, pricing, edge cases)
├── src/
│   ├── types/
│   │   └── index.ts             # Domain models (Passenger, Seat, Meal, Layout, State)
│   ├── data/
│   │   ├── flightData.ts        # Mock flight EA 204 DEL → BOM
│   │   ├── passengerData.ts     # 6 sample passenger profiles
│   │   ├── seatData.ts          # 3-2 & 2-3-2 cabin layouts, categories, occupied sets
│   │   └── mealData.ts          # Meal options and dietary pricing
│   ├── context/
│   │   └── BookingContext.tsx   # Centralized state provider & business actions
│   ├── components/
│   │   ├── Header.tsx           # Mobile navigation top bar with step titles & back button
│   │   ├── StepIndicator.tsx    # 5-step interactive workflow stepper
│   │   ├── BottomBar.tsx        # Sticky bottom bar with live total & primary action CTA
│   │   ├── SeatItem.tsx         # Tactile aircraft seat with status & price badges
│   │   ├── SeatMap.tsx          # Scrollable cabin fuselage with nose, wings, exit rows
│   │   ├── SeatLegend.tsx       # Color & shape accessible legend
│   │   └── ToastMessage.tsx     # Native action feedback banner
│   └── screens/
│       ├── FlightDetailsScreen.tsx     # Schedule, baggage, flight meta
│       ├── PassengerSelectScreen.tsx   # Traveler count & roster management
│       ├── SeatSelectScreen.tsx        # Layout switch, seat grid & active pax selector
│       ├── MealSelectScreen.tsx        # Dining preferences per passenger
│       └── BookingSummaryScreen.tsx    # Itemized receipt & confirmation modal
├── App.tsx                      # Root component wrapped in Safe Area & Context
├── jest.config.js               # Jest configuration
├── tsconfig.json                # TypeScript compiler configuration
├── app.json                     # Expo configuration
└── package.json                 # Dependencies and npm scripts
```

---

## 5. Installation & Setup

### Prerequisites
- Node.js (v18 or newer; tested on Node v23)
- npm or bun

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run TypeScript Check
```bash
npx tsc --noEmit
```

### Step 3: Run Test Suite
```bash
npm test
```

### Step 4: Start the Expo Development Server

```bash
npm start
# or using tunnel mode (useful if router or firewall restricts local connections):
npm run tunnel
# or:
npx expo start --tunnel
```

From the interactive terminal:
- **iOS Simulator**: Press `i` to launch in simulator (or run `npx expo start --localhost`).
- **Android Emulator**: Press `a` to launch in Android Studio.
- **Physical Device**: Scan the displayed QR code with the Expo Go app.
- **Web Browser**: Press `w` to open directly in Chrome/Safari.

---

## 6. Architecture & State Management

The application state is managed by `BookingContext`:

1. **Normalized Seat Assignments**:
   Seat allocations are stored as layout-keyed records:
   ```typescript
   seatAssignments: {
     '3-2': Record<string, string>;   // passengerId -> seatId
     '2-3-2': Record<string, string>; // passengerId -> seatId
   }
   ```
   This ensures that selecting a seat in the 3–2 layout does not overwrite assignments in the 2–3–2 layout, satisfying the requirement for independent configuration states.

2. **Passenger Count Pruning**:
   When the passenger count is reduced:
   - Extra travelers are removed from the active roster.
   - Any seat assignments held by removed passengers in **both** layouts are released immediately.
   - Any meal selections chosen by removed passengers are cleared.
   - Total pricing updates immediately in the same render cycle.
   - If the active selected passenger was among the removed travelers, focus safely falls back to the first traveler.

3. **Seat Assignment Conflict Prevention**:
   - Occupied seats (`isOccupied: true`) are disabled and cannot be pressed.
   - If a seat is already held by another passenger in the current layout, an attempt to assign it is rejected with a warning toast.
   - Selecting a new seat for the active passenger replaces their previous seat.
   - Tapping the currently selected seat removes/unassigns it.

4. **Pricing Calculation**:
   - Total amount is computed dynamically:
   ```typescript
   Total Amount = sum(Seat Prices of all passengers) + sum(Meal Prices of all passengers)
   ```
   - Pricing updates immediately whenever a seat or meal is selected, changed, or removed.

---

## 7. Assumptions & Limitations

- **Mock Data**: Flight schedule, terminal, gate, baggage allowances, passenger names, and seat occupancy are local mock fixtures.
- **Offline Simulation**: The application runs completely client-side without network calls or live payment processing.
- **Seat Availability**: A pre-seeded subset of seats across both layouts is marked as occupied to mirror a real-world commercial flight booking environment.

