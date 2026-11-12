import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  Armchair,
  Layers,
  Trash2,
  User,
  CheckCircle2,
  Info,
} from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';
import { CabinLayoutType } from '../types';
import { SeatLegend } from '../components/SeatLegend';
import { SeatMap } from '../components/SeatMap';

export const SeatSelectScreen: React.FC = () => {
  const {
    state,
    validPassengers,
    activePassenger,
    setActivePassengerId,
    setActiveLayout,
    selectSeat,
    removeSeat,
    getSeatForPassenger,
    getPassengerForSeat,
  } = useBooking();

  const { activeLayout, seatAssignments } = state;
  const currentSeat = getSeatForPassenger(activePassenger.id, activeLayout);
  const activeAssignments = seatAssignments[activeLayout];

  // Number of passengers that have been assigned a seat in this layout
  const assignedCount = validPassengers.filter((p) => Boolean(activeAssignments[p.id])).length;
  const totalCount = validPassengers.length;

  return (
    <View style={styles.container}>
      {/* 1. Layout Segment Control Bar */}
      <View style={styles.layoutBar}>
        <View style={styles.segmentControl}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeLayout === '3-2' && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveLayout('3-2')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                activeLayout === '3-2' && styles.segmentTextActive,
              ]}
            >
              3–2 Single Aisle
            </Text>
            <Text
              style={[
                styles.segmentSubtext,
                activeLayout === '3-2' && styles.segmentSubtextActive,
              ]}
            >
              A B C | D E
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeLayout === '2-3-2' && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveLayout('2-3-2')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                activeLayout === '2-3-2' && styles.segmentTextActive,
              ]}
            >
              2–3–2 Twin Aisle
            </Text>
            <Text
              style={[
                styles.segmentSubtext,
                activeLayout === '2-3-2' && styles.segmentSubtextActive,
              ]}
            >
              A B | C D E | F G
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Horizontal Passenger Selector Pills */}
      <View style={styles.passengerSelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paxScrollContent}
        >
          {validPassengers.map((pax) => {
            const isActive = pax.id === activePassenger.id;
            const assigned = getSeatForPassenger(pax.id, activeLayout);

            return (
              <TouchableOpacity
                key={pax.id}
                style={[styles.paxPill, isActive && styles.paxPillActive]}
                onPress={() => setActivePassengerId(pax.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.paxPillDot,
                    { backgroundColor: pax.avatarColor || '#2563EB' },
                  ]}
                />
                <Text style={[styles.paxPillName, isActive && styles.paxPillNameActive]}>
                  {pax.name.split(' ')[0]}
                </Text>
                {assigned ? (
                  <View style={styles.paxPillSeatBadge}>
                    <Text style={styles.paxPillSeatText}>{assigned.id}</Text>
                  </View>
                ) : (
                  <View style={styles.paxPillUnassignedDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Active Passenger Context Bar */}
      <View style={styles.activePassengerBar}>
        <View style={styles.activeBarLeft}>
          <Text style={styles.activeBarPrompt}>Selecting seat for:</Text>
          <Text style={styles.activeBarName}>{activePassenger.name}</Text>
        </View>

        <View style={styles.activeBarRight}>
          {currentSeat ? (
            <View style={styles.assignedBadgeRow}>
              <View style={styles.seatPill}>
                <Text style={styles.seatPillText}>
                  {currentSeat.id} • {currentSeat.price === 0 ? 'Free' : `₹${currentSeat.price}`}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeSeatBtn}
                onPress={() => removeSeat(activePassenger.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Remove seat"
              >
                <Trash2 size={15} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.noSeatSelectedText}>Tap an available seat</Text>
          )}
        </View>
      </View>

      {/* 4. Compact Legend */}
      <SeatLegend />

      {/* 5. Aircraft Cabin Seat Map */}
      <SeatMap
        layout={activeLayout}
        activePassenger={activePassenger}
        seatAssignments={seatAssignments[activeLayout]}
        validPassengers={validPassengers}
        onSelectSeat={selectSeat}
        getPassengerForSeat={(seatId) => getPassengerForSeat(seatId, activeLayout)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  layoutBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 3,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    fontWeight: '700',
    color: '#0F172A',
  },
  segmentSubtext: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 1,
  },
  segmentSubtextActive: {
    color: '#2563EB',
  },
  passengerSelectorContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  paxScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  paxPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },
  paxPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  paxPillDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  paxPillName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  paxPillNameActive: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  paxPillSeatBadge: {
    backgroundColor: '#0F172A',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
  },
  paxPillSeatText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  paxPillUnassignedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginLeft: 6,
  },
  activePassengerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  activeBarLeft: {
    flex: 1,
  },
  activeBarPrompt: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  activeBarName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  activeBarRight: {
    alignItems: 'flex-end',
  },
  assignedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatPill: {
    backgroundColor: '#0F172A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 6,
  },
  seatPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  removeSeatBtn: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#FEE2E2',
  },
  noSeatSelectedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    fontStyle: 'italic',
  },
});

