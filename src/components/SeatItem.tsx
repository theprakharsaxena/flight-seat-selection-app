import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Check, X, Lock } from 'lucide-react-native';
import { Passenger, SeatDefinition, SeatStatus } from '../types';

interface SeatItemProps {
  seat: SeatDefinition;
  status: SeatStatus;
  assignedPassenger?: Passenger | null;
  activePassenger: Passenger;
  onSelect: (seatId: string) => void;
  compact?: boolean;
}

export const SeatItem: React.FC<SeatItemProps> = ({
  seat,
  status,
  assignedPassenger,
  activePassenger,
  onSelect,
  compact = false,
}) => {
  const isOccupied = status === 'occupied';
  const isSelectedActive = status === 'selected_active';
  const isAssignedOther = status === 'assigned_other';

  const handlePress = () => {
    onSelect(seat.id);
  };

  const getContainerStyle = () => {
    if (isSelectedActive) {
      return [styles.seat, styles.seatSelectedActive];
    }
    if (isAssignedOther) {
      return [
        styles.seat,
        styles.seatAssignedOther,
        assignedPassenger?.avatarColor
          ? { borderColor: assignedPassenger.avatarColor }
          : undefined,
      ];
    }
    if (isOccupied) {
      return [styles.seat, styles.seatOccupied];
    }

    // Available categories
    if (seat.category === 'extra_legroom') {
      return [styles.seat, styles.seatExtraLegroom];
    }
    if (seat.category === 'premium') {
      return [styles.seat, styles.seatPremium];
    }

    return [styles.seat, styles.seatStandard];
  };

  const renderContent = () => {
    // 1. Active Passenger Selected
    if (isSelectedActive) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.seatIdTextActive}>{seat.id}</Text>
          <View style={styles.badgeActive}>
            <Check size={11} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>
      );
    }

    // 2. Assigned to another passenger in current booking
    if (isAssignedOther) {
      const initials = assignedPassenger?.name
        ? assignedPassenger.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()
        : 'PAX';

      return (
        <View style={styles.centerBox}>
          <Text style={styles.seatIdTextOther}>{seat.id}</Text>
          <View
            style={[
              styles.badgeOther,
              assignedPassenger?.avatarColor
                ? { backgroundColor: assignedPassenger.avatarColor }
                : undefined,
            ]}
          >
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
        </View>
      );
    }

    // 3. Occupied by another traveler on this flight
    if (isOccupied) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.seatIdTextOccupied}>{seat.id}</Text>
          <X size={11} color="#94A3B8" strokeWidth={2.5} />
        </View>
      );
    }

    // 4. Available Seat (Free or Paid)
    const priceDisplay = seat.price === 0 ? '₹0' : `₹${seat.price}`;

    return (
      <View style={styles.centerBox}>
        <Text
          style={[
            styles.seatIdText,
            seat.category === 'extra_legroom' && styles.seatIdTextLegroom,
            seat.category === 'premium' && styles.seatIdTextPremium,
          ]}
        >
          {seat.id}
        </Text>
        <Text
          style={[
            styles.priceTag,
            seat.category === 'extra_legroom' && styles.priceTagLegroom,
            seat.category === 'premium' && styles.priceTagPremium,
          ]}
        >
          {priceDisplay}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        getContainerStyle(),
        compact && styles.seatCompact,
      ]}
      onPress={handlePress}
      disabled={isOccupied}
      activeOpacity={0.7}
      accessibilityLabel={`Seat ${seat.id}, ${seat.category}, ${
        seat.price === 0 ? 'Free' : `₹${seat.price}`
      }, ${status}`}
    >
      {/* Visual seat cushion headrest accent */}
      <View
        style={[
          styles.headrest,
          isSelectedActive && styles.headrestActive,
          isOccupied && styles.headrestOccupied,
        ]}
      />
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  seat: {
    width: 38,
    height: 44,
    borderRadius: 7,
    borderWidth: 1.5,
    marginHorizontal: 2.5,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  seatCompact: {
    width: 33,
    height: 42,
    marginHorizontal: 1.5,
  },
  headrest: {
    width: 18,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
    marginBottom: 1,
  },
  headrestActive: {
    backgroundColor: '#93C5FD',
  },
  headrestOccupied: {
    backgroundColor: '#E2E8F0',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  // Seat state variations
  seatStandard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
  },
  seatPremium: {
    backgroundColor: '#F5F3FF',
    borderColor: '#7C3AED',
  },
  seatExtraLegroom: {
    backgroundColor: '#FFFBEB',
    borderColor: '#D97706',
  },
  seatOccupied: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  seatSelectedActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  seatAssignedOther: {
    backgroundColor: '#F8FAFC',
    borderColor: '#64748B',
    borderStyle: 'dashed',
  },
  // Text stylings
  seatIdText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  seatIdTextPremium: {
    color: '#6D28D9',
  },
  seatIdTextLegroom: {
    color: '#B45309',
  },
  seatIdTextActive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seatIdTextOther: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  seatIdTextOccupied: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
  },
  priceTag: {
    fontSize: 8,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  priceTagPremium: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  priceTagLegroom: {
    color: '#D97706',
    fontWeight: '700',
  },
  badgeActive: {
    marginTop: 2,
  },
  badgeOther: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  initialsText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

