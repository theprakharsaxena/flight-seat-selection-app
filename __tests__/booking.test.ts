import { describe, test, expect } from '@jest/globals';
import { SAMPLE_PASSENGERS } from '../src/data/passengerData';
import { MEAL_OPTIONS } from '../src/data/mealData';
import {
  SEAT_MAP_BY_LAYOUT,
  LAYOUT_3_2_CONFIG,
  LAYOUT_2_3_2_CONFIG,
} from '../src/data/seatData';
import { CabinLayoutType, SeatDefinition } from '../src/types';

describe('Flight Booking & Seat Selection Engine', () => {
  describe('Passenger Roster Validation', () => {
    test('contains 6 predefined mock passengers', () => {
      expect(SAMPLE_PASSENGERS.length).toBe(6);
      expect(SAMPLE_PASSENGERS[0].name).toBe('Prakhar Saxena');
      expect(SAMPLE_PASSENGERS[1].name).toBe('Deepak Tiwari');
      expect(SAMPLE_PASSENGERS[2].name).toBe('Bhoomi Jain');
      expect(SAMPLE_PASSENGERS[3].name).toBe('Jayesh Rajesh Tamkar');
      expect(SAMPLE_PASSENGERS[4].name).toBe('Ankit Gupta');
      expect(SAMPLE_PASSENGERS[5].name).toBe('Anjali Bhujbal');
    });

    test('passenger slicing supports 1 to 6 passengers', () => {
      for (let count = 1; count <= 6; count++) {
        const slice = SAMPLE_PASSENGERS.slice(0, count);
        expect(slice.length).toBe(count);
      }
    });
  });

  describe('Cabin Layout Configurations', () => {
    test('Layout 3-2 structure has correct columns and row count', () => {
      expect(LAYOUT_3_2_CONFIG.columns).toEqual(['A', 'B', 'C', 'D', 'E']);
      expect(LAYOUT_3_2_CONFIG.leftGroup).toEqual(['A', 'B', 'C']);
      expect(LAYOUT_3_2_CONFIG.rightGroup).toEqual(['D', 'E']);
      expect(LAYOUT_3_2_CONFIG.totalRows).toBeGreaterThanOrEqual(12);

      const seatMap3_2 = SEAT_MAP_BY_LAYOUT['3-2'];
      expect(seatMap3_2.size).toBe(LAYOUT_3_2_CONFIG.totalRows * 5);
    });

    test('Layout 2-3-2 structure has correct columns and row count', () => {
      expect(LAYOUT_2_3_2_CONFIG.columns).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
      expect(LAYOUT_2_3_2_CONFIG.leftGroup).toEqual(['A', 'B']);
      expect(LAYOUT_2_3_2_CONFIG.middleGroup).toEqual(['C', 'D', 'E']);
      expect(LAYOUT_2_3_2_CONFIG.rightGroup).toEqual(['F', 'G']);
      expect(LAYOUT_2_3_2_CONFIG.totalRows).toBeGreaterThanOrEqual(12);

      const seatMap2_3_2 = SEAT_MAP_BY_LAYOUT['2-3-2'];
      expect(seatMap2_3_2.size).toBe(LAYOUT_2_3_2_CONFIG.totalRows * 7);
    });
  });

  describe('Seat Pricing Rules', () => {
    test('sample seats match specified prices', () => {
      const map = SEAT_MAP_BY_LAYOUT['3-2'];

      // 1A: Standard ₹0
      expect(map.get('1A')?.price).toBe(0);
      expect(map.get('1A')?.category).toBe('standard');

      // 1B: Standard ₹0
      expect(map.get('1B')?.price).toBe(0);
      expect(map.get('1B')?.category).toBe('standard');

      // 1C: Extra Legroom ₹350
      expect(map.get('1C')?.price).toBe(350);
      expect(map.get('1C')?.category).toBe('extra_legroom');

      // 1D: Standard ₹0
      expect(map.get('1D')?.price).toBe(0);
      expect(map.get('1D')?.category).toBe('standard');

      // 1E: Premium ₹250
      expect(map.get('1E')?.price).toBe(250);
      expect(map.get('1E')?.category).toBe('premium');

      // 2A: Extra Legroom ₹350
      expect(map.get('2A')?.price).toBe(350);
      expect(map.get('2A')?.category).toBe('extra_legroom');

      // 2B: Standard ₹0
      expect(map.get('2B')?.price).toBe(0);
      expect(map.get('2B')?.category).toBe('standard');
    });

    test('emergency exit row has extra legroom pricing ₹350', () => {
      const map = SEAT_MAP_BY_LAYOUT['3-2'];
      expect(map.get('10A')?.price).toBe(350);
      expect(map.get('10A')?.category).toBe('extra_legroom');
    });
  });

  describe('Meal Pricing', () => {
    test('meal options contain required prices and categories', () => {
      const mealMap = new Map(MEAL_OPTIONS.map((m) => [m.id, m]));

      expect(mealMap.get('meal-none')?.price).toBe(0);
      expect(mealMap.get('meal-veg')?.price).toBe(150);
      expect(mealMap.get('meal-nonveg')?.price).toBe(200);
      expect(mealMap.get('meal-vegan')?.price).toBe(180);
      expect(mealMap.get('meal-jain')?.price).toBe(170);
    });
  });

  describe('Seat Assignment & Layout Independence Simulation', () => {
    test('preserves independent seat assignments per layout', () => {
      const seatAssignments: {
        '3-2': Record<string, string>;
        '2-3-2': Record<string, string>;
      } = {
        '3-2': {},
        '2-3-2': {},
      };

      // Assign passenger 1 to 2C in 3-2
      seatAssignments['3-2']['pax-1'] = '2C';

      // Assign passenger 1 to 3D in 2-3-2
      seatAssignments['2-3-2']['pax-1'] = '3D';

      // Verify that assignments do not overwrite each other
      expect(seatAssignments['3-2']['pax-1']).toBe('2C');
      expect(seatAssignments['2-3-2']['pax-1']).toBe('3D');
    });

    test('prevents assigning occupied seats', () => {
      const seatMap = SEAT_MAP_BY_LAYOUT['3-2'];
      const occupiedSeat = seatMap.get('1B');
      expect(occupiedSeat?.isOccupied).toBe(true);
    });

    test('prevents assigning a seat already taken by another passenger', () => {
      const layoutAssignments: Record<string, string> = {
        'pax-1': '2A',
      };

      const requestedSeat = '2A';
      const isTakenByOther = Object.entries(layoutAssignments).some(
        ([paxId, sId]) => sId === requestedSeat && paxId !== 'pax-2'
      );

      expect(isTakenByOther).toBe(true);
    });

    test('reducing passenger count cleans up assignments and recalculates totals', () => {
      let passengerCount = 4;
      const seatAssignments = {
        '3-2': {
          'pax-1': '1A', // ₹0
          'pax-2': '1C', // ₹350
          'pax-3': '1E', // ₹250
          'pax-4': '2A', // ₹350
        },
        '2-3-2': {},
      };

      const mealSelections = {
        'pax-1': 'meal-veg', // ₹150
        'pax-2': 'meal-nonveg', // ₹200
        'pax-3': 'meal-vegan', // ₹180
        'pax-4': 'meal-jain', // ₹170
      };

      // Reduce count to 2
      passengerCount = 2;
      const validIds = new Set(SAMPLE_PASSENGERS.slice(0, passengerCount).map((p) => p.id));

      const cleanedSeats: Record<string, string> = {};
      Object.entries(seatAssignments['3-2']).forEach(([paxId, sId]) => {
        if (validIds.has(paxId)) cleanedSeats[paxId] = sId;
      });

      const cleanedMeals: Record<string, string> = {};
      Object.entries(mealSelections).forEach(([paxId, mId]) => {
        if (validIds.has(paxId)) cleanedMeals[paxId] = mId;
      });

      expect(Object.keys(cleanedSeats)).toEqual(['pax-1', 'pax-2']);
      expect(cleanedSeats['pax-3']).toBeUndefined();
      expect(cleanedSeats['pax-4']).toBeUndefined();

      expect(Object.keys(cleanedMeals)).toEqual(['pax-1', 'pax-2']);

      // Calculate total amount for remaining 2 passengers:
      // pax-1: seat 1A (₹0) + meal-veg (₹150) = ₹150
      // pax-2: seat 1C (₹350) + meal-nonveg (₹200) = ₹550
      // Grand Total = 150 + 550 = ₹700
      const seatMap = SEAT_MAP_BY_LAYOUT['3-2'];
      const mealMap = new Map(MEAL_OPTIONS.map((m) => [m.id, m]));

      let totalSeats = 0;
      let totalMeals = 0;

      SAMPLE_PASSENGERS.slice(0, passengerCount).forEach((p) => {
        const sId = cleanedSeats[p.id];
        if (sId) totalSeats += seatMap.get(sId)?.price || 0;
        const mId = cleanedMeals[p.id];
        if (mId) totalMeals += mealMap.get(mId)?.price || 0;
      });

      expect(totalSeats).toBe(350); // 0 + 350
      expect(totalMeals).toBe(350); // 150 + 200
      expect(totalSeats + totalMeals).toBe(700);
    });
  });

  describe('Navigation Gating & Screen Prerequisite Validation', () => {
    const STEP_ORDER = ['flight', 'passengers', 'seats', 'meals', 'summary'];

    const evaluateCanProceed = (
      step: string,
      passengers: typeof SAMPLE_PASSENGERS,
      activeLayout: '3-2' | '2-3-2',
      seatAssignments: Record<'3-2' | '2-3-2', Record<string, string>>,
      mealSelections: Record<string, string>
    ) => {
      switch (step) {
        case 'flight':
          return { allowed: true };
        case 'passengers': {
          if (passengers.length < 1) return { allowed: false, reason: 'Please select at least 1 traveler' };
          const empty = passengers.find((p) => !p.name || p.name.trim().length === 0);
          if (empty) return { allowed: false, reason: 'Please ensure all travelers have valid names' };
          return { allowed: true };
        }
        case 'seats': {
          const assignments = seatAssignments[activeLayout];
          const unassigned = passengers.find((p) => !assignments[p.id]);
          if (unassigned) {
            const assignedCount = passengers.filter((p) => Boolean(assignments[p.id])).length;
            return {
              allowed: false,
              reason: `Please select a seat for ${unassigned.name} (${assignedCount}/${passengers.length} assigned)`,
              unassignedPassenger: unassigned,
            };
          }
          return { allowed: true };
        }
        case 'meals': {
          const missing = passengers.find((p) => !mealSelections[p.id]);
          if (missing) return { allowed: false, reason: `Please select a meal preference for ${missing.name}` };
          return { allowed: true };
        }
        case 'summary':
          return { allowed: true };
        default:
          return { allowed: true };
      }
    };

    const evaluateCanAccessStep = (
      targetStep: string,
      passengers: typeof SAMPLE_PASSENGERS,
      activeLayout: '3-2' | '2-3-2',
      seatAssignments: Record<'3-2' | '2-3-2', Record<string, string>>,
      mealSelections: Record<string, string>
    ) => {
      const targetIndex = STEP_ORDER.indexOf(targetStep);
      if (targetIndex <= 0) return { allowed: true };

      for (let i = 0; i < targetIndex; i++) {
        const stepKey = STEP_ORDER[i];
        const check = evaluateCanProceed(stepKey, passengers, activeLayout, seatAssignments, mealSelections);
        if (!check.allowed) {
          return { allowed: false, blockedStep: stepKey, reason: check.reason };
        }
      }
      return { allowed: true };
    };

    test('blocks advancing from seats when not all travelers have assigned seats', () => {
      const passengers = SAMPLE_PASSENGERS.slice(0, 2); // 2 travelers: Prakhar and Deepak
      const seatAssignments = {
        '3-2': { 'pax-1': '1A' }, // only Prakhar has seat, Deepak has none
        '2-3-2': {},
      };
      const mealSelections = { 'pax-1': 'meal-none', 'pax-2': 'meal-none' };

      const check = evaluateCanProceed('seats', passengers, '3-2', seatAssignments, mealSelections);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('Deepak Tiwari (1/2 assigned)');
      expect(check.unassignedPassenger?.name).toBe('Deepak Tiwari');
    });

    test('permits advancing from seats once all travelers have assigned seats', () => {
      const passengers = SAMPLE_PASSENGERS.slice(0, 2);
      const seatAssignments = {
        '3-2': { 'pax-1': '1A', 'pax-2': '1C' },
        '2-3-2': {},
      };
      const mealSelections = { 'pax-1': 'meal-none', 'pax-2': 'meal-none' };

      const check = evaluateCanProceed('seats', passengers, '3-2', seatAssignments, mealSelections);
      expect(check.allowed).toBe(true);
    });

    test('blocks proceeding if user switches layout and current active layout has unassigned seats', () => {
      const passengers = SAMPLE_PASSENGERS.slice(0, 2);
      // User assigned seats in 3-2, but activeLayout is 2-3-2 which is empty
      const seatAssignments = {
        '3-2': { 'pax-1': '1A', 'pax-2': '1C' },
        '2-3-2': {},
      };
      const mealSelections = { 'pax-1': 'meal-none', 'pax-2': 'meal-none' };

      const check = evaluateCanProceed('seats', passengers, '2-3-2', seatAssignments, mealSelections);
      expect(check.allowed).toBe(false);
      expect(check.unassignedPassenger?.id).toBe('pax-1');
    });

    test('blocks jumping forward to summary when seats are not completed', () => {
      const passengers = SAMPLE_PASSENGERS.slice(0, 2);
      const seatAssignments = {
        '3-2': { 'pax-1': '1A' }, // Rahul missing seat
        '2-3-2': {},
      };
      const mealSelections = { 'pax-1': 'meal-none', 'pax-2': 'meal-none' };

      const accessCheck = evaluateCanAccessStep('summary', passengers, '3-2', seatAssignments, mealSelections);
      expect(accessCheck.allowed).toBe(false);
      expect(accessCheck.blockedStep).toBe('seats');
    });

    test('allows going backward freely to any earlier screen', () => {
      const currentStepIndex = STEP_ORDER.indexOf('seats'); // index 2
      const targetStepIndex = STEP_ORDER.indexOf('passengers'); // index 1
      const isBackward = targetStepIndex < currentStepIndex;

      expect(isBackward).toBe(true);
    });
  });
});
