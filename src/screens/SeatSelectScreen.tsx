import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Trash2, User, Check, Layers, Armchair } from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';
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

  const assignedCount = validPassengers.filter((p) => Boolean(activeAssignments[p.id])).length;
  const totalCount = validPassengers.length;

  return (
    <View style={styles.container}>
      {/* 1. Ultra-clean Top Control Bar: Layout Toggle & Status */}
      <View style={styles.topControlBar}>
        <View style={styles.layoutToggleWrapper}>
          <TouchableOpacity
            style={[
              styles.layoutToggleBtn,
              activeLayout === '3-2' && styles.layoutToggleBtnActive,
            ]}
            onPress={() => setActiveLayout('3-2')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.layoutToggleText,
                activeLayout === '3-2' && styles.layoutToggleTextActive,
              ]}
            >
              3–2 Cabin
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.layoutToggleBtn,
              activeLayout === '2-3-2' && styles.layoutToggleBtnActive,
            ]}
            onPress={() => setActiveLayout('2-3-2')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.layoutToggleText,
                activeLayout === '2-3-2' && styles.layoutToggleTextActive,
              ]}
            >
              2–3–2 Wide-Body
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>
            {assignedCount}/{totalCount} Seats
          </Text>
        </View>
      </View>

      {/* 2. Horizontal Passenger Strip with Quick Seat Badges */}
      <View style={styles.passengerStrip}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paxScroll}
        >
          {validPassengers.map((pax) => {
            const isActive = pax.id === activePassenger.id;
            const assigned = getSeatForPassenger(pax.id, activeLayout);

            return (
              <TouchableOpacity
                key={pax.id}
                style={[styles.paxChip, isActive && styles.paxChipActive]}
                onPress={() => setActivePassengerId(pax.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.paxDot,
                    { backgroundColor: pax.avatarColor || '#2563EB' },
                  ]}
                >
                  <Text style={styles.paxDotText}>
                    {pax.name.charAt(0)}
                  </Text>
                </View>

                <Text style={[styles.paxName, isActive && styles.paxNameActive]}>
                  {pax.name.split(' ')[0]}
                </Text>

                {assigned ? (
                  <View style={styles.seatBadge}>
                    <Text style={styles.seatBadgeText}>{assigned.id}</Text>
                  </View>
                ) : (
                  <View style={styles.seatUnassignedBadge}>
                    <Armchair size={10} color="#94A3B8" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Compact Active Traveler Banner */}
      <View style={styles.activeTravelerBanner}>
        <View style={styles.activeTravelerLeft}>
          <Text style={styles.travelerLabel}>Selecting for</Text>
          <Text style={styles.travelerName}>{activePassenger.name}</Text>
        </View>

        <View style={styles.activeTravelerRight}>
          {currentSeat ? (
            <View style={styles.currentSeatBox}>
              <View style={styles.currentSeatPill}>
                <Text style={styles.currentSeatPillText}>
                  {currentSeat.id} • {currentSeat.price === 0 ? 'Free' : `₹${currentSeat.price}`}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.trashBtn}
                onPress={() => removeSeat(activePassenger.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Clear seat"
              >
                <Trash2 size={13} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.tapPrompt}>Tap an available seat below</Text>
          )}
        </View>
      </View>

      {/* 4. Streamlined Legend */}
      <SeatLegend />

      {/* 5. Full Aircraft Fuselage Map */}
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
  topControlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  layoutToggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2.5,
  },
  layoutToggleBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  layoutToggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  layoutToggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  layoutToggleTextActive: {
    fontWeight: '800',
    color: '#0F172A',
  },
  statusPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E40AF',
  },
  passengerStrip: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  paxScroll: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  paxChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 8,
    marginRight: 6,
  },
  paxChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  paxDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  paxDotText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  paxName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginRight: 6,
  },
  paxNameActive: {
    color: '#1E40AF',
    fontWeight: '800',
  },
  seatBadge: {
    backgroundColor: '#0F172A',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  seatBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seatUnassignedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeTravelerBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  activeTravelerLeft: {
    flex: 1,
  },
  travelerLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
  },
  travelerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  activeTravelerRight: {
    alignItems: 'flex-end',
  },
  currentSeatBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentSeatPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  currentSeatPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  trashBtn: {
    padding: 3,
    borderRadius: 4,
    backgroundColor: '#FEE2E2',
  },
  tapPrompt: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    fontStyle: 'italic',
  },
});
