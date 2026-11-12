import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Check, X } from 'lucide-react-native';
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

  const getSeatStyle = () => {
    if (isSelectedActive) return styles.seatActive;
    if (isAssignedOther) return styles.seatAssigned;
    if (isOccupied) return styles.seatOccupied;
    if (seat.category === 'extra_legroom') return styles.seatLegroom;
    if (seat.category === 'premium') return styles.seatPremium;
    return styles.seatStandard;
  };

  const renderSeatContent = () => {
    if (isSelectedActive) {
      return (
        <View style={styles.centerCol}>
          <Text style={styles.seatLabelActive}>{seat.id}</Text>
          <View style={styles.activeCheckCircle}>
            <Check size={9} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>
      );
    }

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
        <View style={styles.centerCol}>
          <Text style={styles.seatLabelOther}>{seat.id}</Text>
          <View
            style={[
              styles.otherBadge,
              assignedPassenger?.avatarColor
                ? { backgroundColor: assignedPassenger.avatarColor }
                : undefined,
            ]}
          >
            <Text style={styles.otherInitials}>{initials}</Text>
          </View>
        </View>
      );
    }

    if (isOccupied) {
      return (
        <View style={styles.centerCol}>
          <Text style={styles.seatLabelOccupied}>{seat.id}</Text>
          <X size={10} color="#94A3B8" strokeWidth={2.5} />
        </View>
      );
    }

    // Available Free or Paid
    const priceText = seat.price === 0 ? '₹0' : `₹${seat.price}`;
    return (
      <View style={styles.centerCol}>
        <Text
          style={[
            styles.seatLabel,
            seat.category === 'extra_legroom' && styles.seatLabelLegroom,
            seat.category === 'premium' && styles.seatLabelPremium,
          ]}
        >
          {seat.id}
        </Text>
        <Text
          style={[
            styles.seatPrice,
            seat.category === 'extra_legroom' && styles.seatPriceLegroom,
            seat.category === 'premium' && styles.seatPricePremium,
          ]}
        >
          {priceText}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.seatBase,
        getSeatStyle(),
        compact ? styles.seatBaseCompact : styles.seatBaseStandard,
      ]}
      onPress={handlePress}
      disabled={isOccupied}
      activeOpacity={0.7}
      accessibilityLabel={`Seat ${seat.id}, ${seat.category}, ₹${seat.price}, ${status}`}
    >
      {/* Cushioned Headrest Feature */}
      <View
        style={[
          styles.headrest,
          isSelectedActive && styles.headrestActive,
          isOccupied && styles.headrestOccupied,
          seat.category === 'extra_legroom' && !isSelectedActive && styles.headrestLegroom,
          seat.category === 'premium' && !isSelectedActive && styles.headrestPremium,
        ]}
      />

      {/* Main Seat Body */}
      {renderSeatContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  seatBase: {
    borderRadius: 8,
    borderWidth: 1.5,
    marginVertical: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  seatBaseStandard: {
    width: 38,
    height: 45,
    marginHorizontal: 2.5,
  },
  seatBaseCompact: {
    width: 32,
    height: 43,
    marginHorizontal: 1.5,
  },
  headrest: {
    width: 20,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: 1,
  },
  headrestActive: {
    backgroundColor: '#93C5FD',
  },
  headrestOccupied: {
    backgroundColor: '#E2E8F0',
  },
  headrestLegroom: {
    backgroundColor: '#FCD34D',
  },
  headrestPremium: {
    backgroundColor: '#C4B5FD',
  },
  centerCol: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  // Seat Theme Variations
  seatStandard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
  },
  seatPremium: {
    backgroundColor: '#FAF5FF',
    borderColor: '#7C3AED',
  },
  seatLegroom: {
    backgroundColor: '#FFFBEB',
    borderColor: '#D97706',
  },
  seatOccupied: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  seatActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  seatAssigned: {
    backgroundColor: '#F8FAFC',
    borderColor: '#64748B',
    borderStyle: 'dashed',
  },
  // Labels
  seatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  seatLabelLegroom: {
    color: '#B45309',
  },
  seatLabelPremium: {
    color: '#6D28D9',
  },
  seatLabelActive: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seatLabelOther: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  seatLabelOccupied: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
  },
  seatPrice: {
    fontSize: 8,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  seatPriceLegroom: {
    color: '#B45309',
    fontWeight: '800',
  },
  seatPricePremium: {
    color: '#7C3AED',
    fontWeight: '800',
  },
  activeCheckCircle: {
    marginTop: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  otherInitials: {
    fontSize: 7,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
