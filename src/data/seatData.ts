import { CabinLayoutType, SeatCategory, SeatDefinition } from '../types';

export const SEAT_PRICES: Record<SeatCategory, number> = {
  standard: 0,
  premium: 250,
  extra_legroom: 350,
};

export const SEAT_CATEGORY_LABELS: Record<SeatCategory, string> = {
  standard: 'Standard',
  premium: 'Premium',
  extra_legroom: 'Extra Legroom',
};

// Layout 1: 3-2 structure (A B C | D E)
export const LAYOUT_3_2_CONFIG = {
  id: '3-2' as CabinLayoutType,
  name: '3–2 Single Aisle',
  subtitle: 'Regional Jet (5 seats per row)',
  columns: ['A', 'B', 'C', 'D', 'E'],
  leftGroup: ['A', 'B', 'C'],
  rightGroup: ['D', 'E'],
  totalRows: 14,
  exitRows: [10],
  wingRows: [7, 8, 9],
};

// Layout 2: 2-3-2 structure (A B | C D E | F G)
export const LAYOUT_2_3_2_CONFIG = {
  id: '2-3-2' as CabinLayoutType,
  name: '2–3–2 Twin Aisle',
  subtitle: 'Wide-Body Jet (7 seats per row)',
  columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  leftGroup: ['A', 'B'],
  middleGroup: ['C', 'D', 'E'],
  rightGroup: ['F', 'G'],
  totalRows: 14,
  exitRows: [10],
  wingRows: [7, 8, 9],
};

// Specific sample seats from master prompt:
// 1A: Standard ₹0, 1B: Standard ₹0, 1C: Extra Legroom ₹350, 1D: Standard ₹0, 1E: Premium ₹250
// 2A: Extra Legroom ₹350, 2B: Standard ₹0
const SPECIFIC_SEAT_OVERRIDES: Record<string, { category: SeatCategory; price: number }> = {
  '1A': { category: 'standard', price: 0 },
  '1B': { category: 'standard', price: 0 },
  '1C': { category: 'extra_legroom', price: 350 },
  '1D': { category: 'standard', price: 0 },
  '1E': { category: 'premium', price: 250 },
  '2A': { category: 'extra_legroom', price: 350 },
  '2B': { category: 'standard', price: 0 },
};

// List of predetermined occupied seats for realistic booking simulation
const OCCUPIED_SEATS_3_2 = new Set([
  '1B', '3A', '3E', '4C', '5B', '6D', '7A', '7E',
  '8B', '8C', '9E', '10C', '11A', '12B', '12D', '13E', '14A'
]);

const OCCUPIED_SEATS_2_3_2 = new Set([
  '1B', '2D', '3A', '3G', '4C', '4E', '5B', '6F', '7A',
  '7D', '8C', '8G', '9E', '10B', '10F', '11C', '12A', '12G', '13D', '14F'
]);

function determineCategory(row: number, col: string): { category: SeatCategory; price: number } {
  const seatId = `${row}${col}`;
  if (SPECIFIC_SEAT_OVERRIDES[seatId]) {
    return SPECIFIC_SEAT_OVERRIDES[seatId];
  }

  // Row 10 is Emergency Exit Row with extra legroom
  if (row === 10) {
    return { category: 'extra_legroom', price: 350 };
  }

  // Row 1 & 2 front bulkhead
  if (row <= 2) {
    if (col === 'C' || col === 'D') {
      return { category: 'premium', price: 250 };
    }
    return { category: 'standard', price: 0 };
  }

  // Rows 3-4 are Premium zone
  if (row === 3 || row === 4) {
    return { category: 'premium', price: 250 };
  }

  // Aisle and window seats in rows 5-6 have premium option
  if ((row === 5 || row === 6) && (col === 'A' || col === 'C' || col === 'D' || col === 'G')) {
    return { category: 'premium', price: 250 };
  }

  // All other seats are Standard (₹0)
  return { category: 'standard', price: 0 };
}

export function generateSeatsFor3_2(): SeatDefinition[] {
  const seats: SeatDefinition[] = [];
  const { totalRows, columns, exitRows } = LAYOUT_3_2_CONFIG;

  for (let r = 1; r <= totalRows; r++) {
    for (const c of columns) {
      const id = `${r}${c}`;
      const { category, price } = determineCategory(r, c);
      const isOccupied = OCCUPIED_SEATS_3_2.has(id);

      const features: string[] = [];
      if (c === 'A' || c === 'E') features.push('Window');
      if (c === 'C' || c === 'D') features.push('Aisle');
      if (exitRows.includes(r)) features.push('Exit Row');
      if (category === 'extra_legroom') features.push('Extra Legroom');

      seats.push({
        id,
        row: r,
        col: c,
        category,
        price,
        isOccupied,
        features,
      });
    }
  }

  return seats;
}

export function generateSeatsFor2_3_2(): SeatDefinition[] {
  const seats: SeatDefinition[] = [];
  const { totalRows, columns, exitRows } = LAYOUT_2_3_2_CONFIG;

  for (let r = 1; r <= totalRows; r++) {
    for (const c of columns) {
      const id = `${r}${c}`;
      const { category, price } = determineCategory(r, c);
      const isOccupied = OCCUPIED_SEATS_2_3_2.has(id);

      const features: string[] = [];
      if (c === 'A' || c === 'G') features.push('Window');
      if (c === 'B' || c === 'C' || c === 'E' || c === 'F') features.push('Aisle');
      if (c === 'D') features.push('Middle');
      if (exitRows.includes(r)) features.push('Exit Row');
      if (category === 'extra_legroom') features.push('Extra Legroom');

      seats.push({
        id,
        row: r,
        col: c,
        category,
        price,
        isOccupied,
        features,
      });
    }
  }

  return seats;
}

export const SEATS_BY_LAYOUT: Record<CabinLayoutType, SeatDefinition[]> = {
  '3-2': generateSeatsFor3_2(),
  '2-3-2': generateSeatsFor2_3_2(),
};

export const SEAT_MAP_BY_LAYOUT: Record<CabinLayoutType, Map<string, SeatDefinition>> = {
  '3-2': new Map(SEATS_BY_LAYOUT['3-2'].map((s) => [s.id, s])),
  '2-3-2': new Map(SEATS_BY_LAYOUT['2-3-2'].map((s) => [s.id, s])),
};

