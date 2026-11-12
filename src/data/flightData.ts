import { FlightInfo } from '../types';

export const MOCK_FLIGHT: FlightInfo = {
  airline: 'Example Airways',
  flightNumber: 'EA 204',
  aircraftType: 'Twin-Engine Jetliner',
  origin: {
    code: 'DEL',
    city: 'Delhi',
    airport: 'Indira Gandhi International Airport',
    terminal: 'T3',
  },
  destination: {
    code: 'BOM',
    city: 'Mumbai',
    airport: 'Chhatrapati Shivaji Maharaj Intl Airport',
    terminal: 'T2',
  },
  departureTime: '09:30 AM',
  arrivalTime: '11:45 AM',
  date: 'Friday, 14 Nov 2026',
  duration: '2h 15m',
  cabinClass: 'Economy',
  gate: 'B12',
  boardingTime: '08:45 AM',
};

