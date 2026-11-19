import { describe, test, expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import bookingReducer, {
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
} from '../src/store/bookingSlice';
import {
  selectValidPassengers,
  selectActivePassenger,
  selectPassengerSummaries,
  selectTotalSeatCharges,
  selectTotalMealCharges,
  selectTotalAmount,
} from '../src/store/bookingSelectors';
import { RootState } from '../src/store';

const createTestStore = () =>
  configureStore({
    reducer: {
      booking: bookingReducer,
    },
  });

describe('Redux Toolkit Booking Store & Slice', () => {
  test('initializes with default state (2 passengers, 3-2 cabin, flight step)', () => {
    const store = createTestStore();
    const state = store.getState();

    expect(state.booking.passengerCount).toBe(2);
    expect(state.booking.activePassengerId).toBe('pax-1');
    expect(state.booking.activeLayout).toBe('3-2');
    expect(state.booking.currentStep).toBe('flight');
    expect(state.booking.isBookingConfirmed).toBe(false);

    const validPassengers = selectValidPassengers(state as RootState);
    expect(validPassengers.length).toBe(2);
    expect(validPassengers[0].name).toBe('Prakhar Saxena');
    expect(validPassengers[1].name).toBe('Deepak Tiwari');
  });

  test('setPassengerCount updates count and prunes assignments when reducing', () => {
    const store = createTestStore();

    // Increase to 3
    store.dispatch(setPassengerCount(3));
    expect(store.getState().booking.passengerCount).toBe(3);

    // Assign seat to pax-3
    store.dispatch(
      assignSeatDirect({
        passengerId: 'pax-3',
        seatId: '2A',
        layout: '3-2',
      })
    );
    expect(store.getState().booking.seatAssignments['3-2']['pax-3']).toBe('2A');

    // Reduce count back to 2 -> should prune pax-3's seat
    store.dispatch(setPassengerCount(2));
    expect(store.getState().booking.passengerCount).toBe(2);
    expect(store.getState().booking.seatAssignments['3-2']['pax-3']).toBeUndefined();
  });

  test('bounds check on passengerCount (must be between 1 and 6)', () => {
    const store = createTestStore();

    // Try setting to 0 -> should be ignored
    store.dispatch(setPassengerCount(0));
    expect(store.getState().booking.passengerCount).toBe(2);

    // Try setting to 7 -> should be ignored
    store.dispatch(setPassengerCount(7));
    expect(store.getState().booking.passengerCount).toBe(2);

    // Set to 6 -> valid
    store.dispatch(setPassengerCount(6));
    expect(store.getState().booking.passengerCount).toBe(6);
  });

  test('switches active passenger and active layout independently', () => {
    const store = createTestStore();

    store.dispatch(setActivePassengerId('pax-2'));
    expect(store.getState().booking.activePassengerId).toBe('pax-2');

    const activePax = selectActivePassenger(store.getState() as RootState);
    expect(activePax.name).toBe('Deepak Tiwari');

    store.dispatch(setActiveLayout('2-3-2'));
    expect(store.getState().booking.activeLayout).toBe('2-3-2');
    expect(store.getState().booking.toast?.message).toContain('2–3–2 Twin Aisle');
  });

  test('seat assignment preserves independent allocations per layout', () => {
    const store = createTestStore();

    // Assign in 3-2
    store.dispatch(
      assignSeatDirect({
        passengerId: 'pax-1',
        seatId: '1A',
        layout: '3-2',
      })
    );

    // Assign in 2-3-2
    store.dispatch(
      assignSeatDirect({
        passengerId: 'pax-1',
        seatId: '1D',
        layout: '2-3-2',
      })
    );

    const assignments = store.getState().booking.seatAssignments;
    expect(assignments['3-2']['pax-1']).toBe('1A');
    expect(assignments['2-3-2']['pax-1']).toBe('1D');
  });

  test('meal selection and dynamic cost calculation via selectors', () => {
    const store = createTestStore();

    // Pax-1: seat 1C (₹350) + Vegetarian meal (₹150) = ₹500
    store.dispatch(
      assignSeatDirect({
        passengerId: 'pax-1',
        seatId: '1C',
        layout: '3-2',
      })
    );
    store.dispatch(selectMeal({ passengerId: 'pax-1', mealId: 'meal-veg' }));

    // Pax-2: seat 1E (₹250) + Non-veg meal (₹200) = ₹450
    store.dispatch(
      assignSeatDirect({
        passengerId: 'pax-2',
        seatId: '1E',
        layout: '3-2',
      })
    );
    store.dispatch(selectMeal({ passengerId: 'pax-2', mealId: 'meal-nonveg' }));

    const state = store.getState() as RootState;
    const summaries = selectPassengerSummaries(state);
    expect(summaries[0].totalPassengerCost).toBe(500); // 350 + 150
    expect(summaries[1].totalPassengerCost).toBe(450); // 250 + 200

    expect(selectTotalSeatCharges(state)).toBe(600); // 350 + 250
    expect(selectTotalMealCharges(state)).toBe(350); // 150 + 200
    expect(selectTotalAmount(state)).toBe(950); // 600 + 350
  });

  test('updatePassengerName rejects empty strings and updates valid names', () => {
    const store = createTestStore();

    // Empty string attempt
    store.dispatch(updatePassengerName({ passengerId: 'pax-1', newName: '   ' }));
    expect(store.getState().booking.passengersList[0].name).toBe('Prakhar Saxena');
    expect(store.getState().booking.toast?.type).toBe('warning');

    // Valid update
    store.dispatch(updatePassengerName({ passengerId: 'pax-1', newName: 'Prakhar S.' }));
    expect(store.getState().booking.passengersList[0].name).toBe('Prakhar S.');
    expect(store.getState().booking.toast?.type).toBe('success');
  });

  test('removePassenger decrements count and cleans up allocated seats & meals', () => {
    const store = createTestStore();
    store.dispatch(setPassengerCount(3));

    // Assign seat to pax-2
    store.dispatch(assignSeatDirect({ passengerId: 'pax-2', seatId: '1C', layout: '3-2' }));
    store.dispatch(selectMeal({ passengerId: 'pax-2', mealId: 'meal-nonveg' }));

    // Remove pax-2
    store.dispatch(removePassenger('pax-2'));
    const state = store.getState();

    expect(state.booking.passengerCount).toBe(2);
    expect(state.booking.seatAssignments['3-2']['pax-2']).toBeUndefined();
    expect(state.booking.mealSelections['pax-2']).toBeUndefined();
  });

  test('resetBooking restores original defaults', () => {
    const store = createTestStore();
    store.dispatch(setPassengerCount(4));
    store.dispatch(setActiveLayout('2-3-2'));
    store.dispatch(setCurrentStep('summary'));
    store.dispatch(confirmBooking());

    expect(store.getState().booking.isBookingConfirmed).toBe(true);

    store.dispatch(resetBooking());
    const state = store.getState().booking;

    expect(state.passengerCount).toBe(2);
    expect(state.activeLayout).toBe('3-2');
    expect(state.currentStep).toBe('flight');
    expect(state.isBookingConfirmed).toBe(false);
    expect(Object.keys(state.seatAssignments['3-2']).length).toBe(0);
  });

  test('hydrateState restores persisted booking snapshot cleanly', () => {
    const store = createTestStore();
    store.dispatch(
      hydrateState({
        passengerCount: 3,
        activePassengerId: 'pax-2',
        activeLayout: '2-3-2',
        currentStep: 'seats',
        seatAssignments: {
          '3-2': {},
          '2-3-2': { 'pax-1': '1A', 'pax-2': '1D' },
        },
        mealSelections: {
          'pax-1': 'meal-veg',
          'pax-2': 'meal-none',
        },
      })
    );

    const state = store.getState().booking;
    expect(state.passengerCount).toBe(3);
    expect(state.activePassengerId).toBe('pax-2');
    expect(state.activeLayout).toBe('2-3-2');
    expect(state.currentStep).toBe('seats');
    expect(state.seatAssignments['2-3-2']['pax-2']).toBe('1D');
    expect(state.mealSelections['pax-1']).toBe('meal-veg');
    expect(state.toast).toBeNull();
  });
});
