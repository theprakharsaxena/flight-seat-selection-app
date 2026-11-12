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
  Sparkles,
} from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';

export const FlightDetailsScreen: React.FC = () => {
  const { state, nextStep } = useBooking();
  const { flight, passengerCount } = state;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Boarding Ticket Style Card */}
      <View style={styles.ticketCard}>
        {/* Ticket Header */}
        <View style={styles.ticketHeader}>
          <View style={styles.airBadge}>
            <Plane size={15} color="#2563EB" />
            <Text style={styles.airlineTitle}>{flight.airline}</Text>
          </View>
          <View style={styles.flightTag}>
            <Text style={styles.flightCodeText}>{flight.flightNumber}</Text>
            <Text style={styles.classText}>• {flight.cabinClass}</Text>
          </View>
        </View>

        {/* Airport Route Section */}
        <View style={styles.routeSection}>
          <View style={styles.originCol}>
            <Text style={styles.cityCode}>{flight.origin.code}</Text>
            <Text style={styles.cityName}>{flight.origin.city}</Text>
            <Text style={styles.timeVal}>{flight.departureTime}</Text>
            <Text style={styles.terminalVal}>Terminal {flight.origin.terminal}</Text>
          </View>

          {/* Plane Flight Graphic */}
          <View style={styles.flightMiddle}>
            <Text style={styles.durationVal}>{flight.duration}</Text>
            <View style={styles.flightLineRow}>
              <View style={styles.routeDot} />
              <View style={styles.routeLine} />
              <Plane size={14} color="#0F172A" style={styles.planeIconRotated} />
              <View style={styles.routeLine} />
              <View style={styles.routeDot} />
            </View>
            <Text style={styles.nonstopVal}>Non-stop</Text>
          </View>

          <View style={styles.destCol}>
            <Text style={styles.cityCode}>{flight.destination.code}</Text>
            <Text style={styles.cityName}>{flight.destination.city}</Text>
            <Text style={styles.timeVal}>{flight.arrivalTime}</Text>
            <Text style={styles.terminalVal}>Terminal {flight.destination.terminal}</Text>
          </View>
        </View>

        {/* Perforated Ticket Divider Effect */}
        <View style={styles.ticketDivider}>
          <View style={styles.notchLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.notchRight} />
        </View>

        {/* Flight Meta Info Footer */}
        <View style={styles.ticketFooter}>
          <View style={styles.metaCol}>
            <Calendar size={13} color="#64748B" />
            <Text style={styles.metaTxt}>{flight.date}</Text>
          </View>
          <View style={styles.metaCol}>
            <Clock size={13} color="#64748B" />
            <Text style={styles.metaTxt}>Boarding {flight.boardingTime}</Text>
          </View>
          <View style={styles.metaCol}>
            <MapPin size={13} color="#64748B" />
            <Text style={styles.metaTxt}>Gate {flight.gate}</Text>
          </View>
        </View>
      </View>

      {/* Baggage & Allowances Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>INCLUDED COMPLIMENTARY</Text>

        <View style={styles.perkRow}>
          <View style={styles.perkIcon}>
            <Luggage size={16} color="#0F172A" />
          </View>
          <View style={styles.perkContent}>
            <Text style={styles.perkHeading}>Check-in Baggage</Text>
            <Text style={styles.perkSub}>15 kg included per passenger</Text>
          </View>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>Free</Text>
          </View>
        </View>

        <View style={[styles.perkRow, styles.perkBorderTop]}>
          <View style={styles.perkIcon}>
            <ShieldCheck size={16} color="#0F172A" />
          </View>
          <View style={styles.perkContent}>
            <Text style={styles.perkHeading}>Cabin Hand Baggage</Text>
            <Text style={styles.perkSub}>7 kg overhead bag + laptop sleeve</Text>
          </View>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>Free</Text>
          </View>
        </View>
      </View>

      {/* Quick Passenger Action Card */}
      <TouchableOpacity
        style={styles.paxNavCard}
        onPress={nextStep}
        activeOpacity={0.85}
      >
        <View style={styles.paxNavLeft}>
          <Text style={styles.paxNavNumber}>
            {passengerCount} {passengerCount === 1 ? 'Traveler' : 'Travelers'}
          </Text>
          <Text style={styles.paxNavSub}>
            Tap to manage names and count (1 to 6)
          </Text>
        </View>
        <View style={styles.paxNavBtn}>
          <Text style={styles.paxNavBtnText}>Manage</Text>
          <ChevronRight size={15} color="#2563EB" />
        </View>
      </TouchableOpacity>
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
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  airBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 6,
  },
  flightTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flightCodeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  classText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 3,
  },
  routeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  originCol: {
    flex: 1,
  },
  destCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cityCode: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  cityName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 1,
  },
  timeVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  terminalVal: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  flightMiddle: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  durationVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  flightLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
    justifyContent: 'center',
  },
  routeLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#CBD5E1',
  },
  routeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#64748B',
  },
  planeIconRotated: {
    marginHorizontal: 4,
    transform: [{ rotate: '90deg' }],
  },
  nonstopVal: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: 4,
  },
  ticketDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  notchLeft: {
    width: 14,
    height: 24,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#E2E8F0',
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  notchRight: {
    width: 14,
    height: 24,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#E2E8F0',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  metaCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaTxt: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  perkBorderTop: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  perkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  perkContent: {
    flex: 1,
  },
  perkHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  perkSub: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 1,
  },
  freeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  paxNavCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  paxNavLeft: {
    flex: 1,
  },
  paxNavNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  paxNavSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  paxNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  paxNavBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
    marginRight: 2,
  },
});
