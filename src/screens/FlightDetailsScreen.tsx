import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Plane,
  Clock,
  Calendar,
  Luggage,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';

export const FlightDetailsScreen: React.FC = () => {
  const { state, nextStep, setPassengerCount } = useBooking();
  const { flight, passengerCount } = state;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Route & Times Main Card */}
      <View style={styles.flightCard}>
        {/* Airline & Status Bar */}
        <View style={styles.cardHeader}>
          <View style={styles.airlineBadge}>
            <Plane size={15} color="#2563EB" />
            <Text style={styles.airlineName}>{flight.airline}</Text>
          </View>
          <View style={styles.flightNumberTag}>
            <Text style={styles.flightNumberText}>{flight.flightNumber}</Text>
            <Text style={styles.classText}>• {flight.cabinClass}</Text>
          </View>
        </View>

        {/* Airport Route Visualization */}
        <View style={styles.routeSection}>
          {/* Origin */}
          <View style={styles.locationBlock}>
            <Text style={styles.airportCode}>{flight.origin.code}</Text>
            <Text style={styles.cityName}>{flight.origin.city}</Text>
            <Text style={styles.timeText}>{flight.departureTime}</Text>
            <Text style={styles.terminalText}>Terminal {flight.origin.terminal}</Text>
          </View>

          {/* Duration Graphic */}
          <View style={styles.flightGraphic}>
            <Text style={styles.durationText}>{flight.duration}</Text>
            <View style={styles.pathLineContainer}>
              <View style={styles.dot} />
              <View style={styles.pathLine} />
              <Plane size={14} color="#0F172A" style={styles.planeIcon} />
              <View style={styles.pathLine} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.nonStopText}>Non-stop</Text>
          </View>

          {/* Destination */}
          <View style={[styles.locationBlock, styles.locationBlockRight]}>
            <Text style={styles.airportCode}>{flight.destination.code}</Text>
            <Text style={styles.cityName}>{flight.destination.city}</Text>
            <Text style={styles.timeText}>{flight.arrivalTime}</Text>
            <Text style={styles.terminalText}>Terminal {flight.destination.terminal}</Text>
          </View>
        </View>

        {/* Date and Boarding Information Footer */}
        <View style={styles.flightMetaRow}>
          <View style={styles.metaItem}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.metaLabel}>{flight.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.metaLabel}>Boarding {flight.boardingTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.metaLabel}>Gate {flight.gate}</Text>
          </View>
        </View>
      </View>

      {/* Flight Inclusions & Policy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>BAGGAGE & INCLUSIONS</Text>

        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <Luggage size={18} color="#0F172A" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Check-in Baggage</Text>
            <Text style={styles.infoDescription}>
              15 kg per passenger included free of charge
            </Text>
          </View>
          <Text style={styles.badgeIncluded}>Included</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={18} color="#0F172A" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Cabin Hand Baggage</Text>
            <Text style={styles.infoDescription}>
              1 piece up to 7 kg + personal laptop bag
            </Text>
          </View>
          <Text style={styles.badgeIncluded}>Included</Text>
        </View>
      </View>

      {/* Passenger Selection Quick Access */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PASSENGERS FOR THIS FLIGHT</Text>
        <View style={styles.paxQuickCard}>
          <View>
            <Text style={styles.paxCountTitle}>
              {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}
            </Text>
            <Text style={styles.paxSubtitle}>
              You can adjust travelers (1 to 6) in the next step
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changePaxButton}
            onPress={nextStep}
            activeOpacity={0.7}
          >
            <Text style={styles.changePaxText}>Manage</Text>
            <ChevronRight size={15} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Aircraft Seating Preview Notice */}
      <View style={styles.aircraftNotice}>
        <Info size={16} color="#475569" style={styles.noticeIcon} />
        <Text style={styles.noticeText}>
          Standard seat selection is available for ₹0. Extra legroom and premium seats are optional paid upgrades. Switch between 3–2 and 2–3–2 configurations anytime in the seat selection screen.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  flightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 16,
  },
  airlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 6,
  },
  flightNumberTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flightNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  classText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 4,
  },
  routeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationBlock: {
    flex: 1,
  },
  locationBlockRight: {
    alignItems: 'flex-end',
  },
  airportCode: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  cityName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 1,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 6,
  },
  terminalText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  flightGraphic: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  pathLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    justifyContent: 'center',
  },
  pathLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#CBD5E1',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#64748B',
  },
  planeIcon: {
    marginHorizontal: 4,
    transform: [{ rotate: '90deg' }],
  },
  nonStopText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    marginTop: 4,
  },
  flightMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 5,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  infoDescription: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 2,
  },
  badgeIncluded: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paxQuickCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  paxCountTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  paxSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 2,
  },
  changePaxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
  },
  changePaxText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 2,
  },
  aircraftNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noticeIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 18,
  },
});

