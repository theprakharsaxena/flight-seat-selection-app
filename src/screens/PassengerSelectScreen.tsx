import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Users,
  Plus,
  Minus,
  CheckCircle,
  Armchair,
  Utensils,
  ChevronRight,
  UserCheck,
} from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';
import { SAMPLE_PASSENGERS } from '../data/passengerData';

export const PassengerSelectScreen: React.FC = () => {
  const {
    state,
    validPassengers,
    activePassenger,
    setActivePassengerId,
    setPassengerCount,
    getSeatForPassenger,
    nextStep,
  } = useBooking();

  const { passengerCount, activeLayout, mealSelections } = state;

  const handleIncrement = () => {
    if (passengerCount < 6) {
      setPassengerCount(passengerCount + 1);
    }
  };

  const handleDecrement = () => {
    if (passengerCount > 1) {
      setPassengerCount(passengerCount - 1);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Passenger Counter Section */}
      <View style={styles.counterCard}>
        <View style={styles.counterHeader}>
          <View style={styles.counterTitleGroup}>
            <Text style={styles.cardHeading}>Number of Passengers</Text>
            <Text style={styles.cardSubheading}>
              Select between 1 and 6 passengers for this booking
            </Text>
          </View>

          {/* Stepper +/- */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={[
                styles.stepButton,
                passengerCount <= 1 && styles.stepButtonDisabled,
              ]}
              onPress={handleDecrement}
              disabled={passengerCount <= 1}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Decrease passenger count"
            >
              <Minus size={18} color={passengerCount <= 1 ? '#94A3B8' : '#0F172A'} />
            </TouchableOpacity>

            <View style={styles.countDisplay}>
              <Text style={styles.countText}>{passengerCount}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.stepButton,
                passengerCount >= 6 && styles.stepButtonDisabled,
              ]}
              onPress={handleIncrement}
              disabled={passengerCount >= 6}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Increase passenger count"
            >
              <Plus size={18} color={passengerCount >= 6 ? '#94A3B8' : '#0F172A'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick select pills (1 to 6) */}
        <View style={styles.pillRow}>
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const isSelected = passengerCount === num;
            return (
              <TouchableOpacity
                key={num}
                style={[styles.numberPill, isSelected && styles.numberPillActive]}
                onPress={() => setPassengerCount(num)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.numberPillText,
                    isSelected && styles.numberPillTextActive,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Passenger List Header */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.sectionTitle}>PASSENGER ROSTER</Text>
        <Text style={styles.sectionSubtitle}>
          Tap a passenger to set as active for seat & meal selection
        </Text>
      </View>

      {/* List of active passengers */}
      {validPassengers.map((passenger, index) => {
        const isActive = passenger.id === activePassenger.id;
        const assignedSeat = getSeatForPassenger(passenger.id, activeLayout);
        const mealId = mealSelections[passenger.id];
        const hasMeal = mealId && mealId !== 'meal-none';

        return (
          <TouchableOpacity
            key={passenger.id}
            style={[styles.passengerCard, isActive && styles.passengerCardActive]}
            onPress={() => setActivePassengerId(passenger.id)}
            activeOpacity={0.8}
          >
            {/* Left Avatar & Name */}
            <View style={styles.paxMainRow}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: passenger.avatarColor || '#2563EB' },
                ]}
              >
                <Text style={styles.avatarText}>
                  {passenger.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)}
                </Text>
              </View>

              <View style={styles.paxInfo}>
                <View style={styles.nameRow}>
                  <Text style={[styles.paxName, isActive && styles.paxNameActive]}>
                    {passenger.name}
                  </Text>
                  {isActive && (
                    <View style={styles.activeTag}>
                      <UserCheck size={11} color="#2563EB" />
                      <Text style={styles.activeTagText}>Active</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.paxCode}>
                  Traveler {index + 1} • {passenger.code}
                </Text>
              </View>
            </View>

            {/* Current Selections Status for this passenger */}
            <View style={styles.statusRow}>
              {/* Seat status badge */}
              <View
                style={[
                  styles.statusBadge,
                  assignedSeat ? styles.statusBadgeAssigned : styles.statusBadgeUnassigned,
                ]}
              >
                <Armchair
                  size={14}
                  color={assignedSeat ? '#0F172A' : '#94A3B8'}
                  style={styles.badgeIcon}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    assignedSeat && styles.statusBadgeTextAssigned,
                  ]}
                >
                  {assignedSeat
                    ? `Seat ${assignedSeat.id} (${assignedSeat.price === 0 ? 'Free' : `₹${assignedSeat.price}`})`
                    : 'No Seat Assigned'}
                </Text>
              </View>

              {/* Meal status badge */}
              <View
                style={[
                  styles.statusBadge,
                  hasMeal ? styles.statusBadgeAssigned : styles.statusBadgeUnassigned,
                ]}
              >
                <Utensils
                  size={14}
                  color={hasMeal ? '#059669' : '#94A3B8'}
                  style={styles.badgeIcon}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    hasMeal && styles.statusBadgeTextMeal,
                  ]}
                >
                  {hasMeal ? 'Meal Selected' : 'No Meal Added'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Helpful Hint */}
      <View style={styles.guidanceBox}>
        <Text style={styles.guidanceTitle}>Selection Workflow</Text>
        <Text style={styles.guidanceText}>
          Each passenger receives an independent seat in your chosen cabin configuration ({activeLayout}). If you change the passenger count later, unallocated seats will be released automatically.
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
  counterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  counterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  counterTitleGroup: {
    flex: 1,
    paddingRight: 12,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubheading: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 3,
  },
  stepButton: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  stepButtonDisabled: {
    backgroundColor: '#F1F5F9',
    elevation: 0,
    shadowOpacity: 0,
  },
  countDisplay: {
    width: 32,
    alignItems: 'center',
  },
  countText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  numberPill: {
    flex: 1,
    height: 36,
    marginHorizontal: 3,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  numberPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  numberPillTextActive: {
    color: '#FFFFFF',
  },
  listHeaderRow: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94A3B8',
    marginTop: 2,
  },
  passengerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  passengerCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFC',
  },
  paxMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  paxInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paxName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  paxNameActive: {
    color: '#1E40AF',
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF',
    marginLeft: 3,
  },
  paxCode: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
  },
  statusBadgeAssigned: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  statusBadgeUnassigned: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E2E8F0',
  },
  badgeIcon: {
    marginRight: 5,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
  statusBadgeTextAssigned: {
    color: '#0F172A',
    fontWeight: '600',
  },
  statusBadgeTextMeal: {
    color: '#059669',
    fontWeight: '600',
  },
  guidanceBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  guidanceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  guidanceText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 16,
  },
});

