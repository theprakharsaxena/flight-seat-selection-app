import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Check } from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';

interface BottomBarProps {
  primaryLabel?: string;
  onPressPrimary?: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  primaryLabel,
  onPressPrimary,
}) => {
  const insets = useSafeAreaInsets();
  const {
    currentStep,
    nextStep,
    totalAmount,
    totalSeatCharges,
    totalMealCharges,
    validPassengers,
    state,
    confirmBooking,
  } = useBooking();

  const activeSeats = state.seatAssignments[state.activeLayout];
  const assignedSeatCount = validPassengers.filter((p) => Boolean(activeSeats[p.id])).length;
  const totalPax = validPassengers.length;
  const isSeatIncomplete = currentStep === 'seats' && assignedSeatCount < totalPax;

  const getDefaultButtonLabel = () => {
    switch (currentStep) {
      case 'flight':
        return 'Select Passengers';
      case 'passengers':
        return 'Choose Seats';
      case 'seats':
        return assignedSeatCount === totalPax
          ? 'Continue to Meals'
          : `Assign Seats (${assignedSeatCount}/${totalPax})`;
      case 'meals':
        return 'Review Booking';
      case 'summary':
        return 'Confirm Selection';
      default:
        return 'Continue';
    }
  };

  const handlePrimaryPress = () => {
    if (onPressPrimary) {
      onPressPrimary();
    } else if (currentStep === 'summary') {
      confirmBooking();
    } else {
      nextStep();
    }
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.container}>
        {/* Left Side: Dynamic Total Amount */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceMeta}>Total Amount</Text>
          <Text style={styles.priceMain}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.priceSub}>
            Seats: ₹{totalSeatCharges} • Meals: ₹{totalMealCharges}
          </Text>
        </View>

        {/* Right Side: Primary CTA */}
        <TouchableOpacity
          style={[styles.actionBtn, isSeatIncomplete && styles.actionBtnIncomplete]}
          onPress={handlePrimaryPress}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>
            {primaryLabel || getDefaultButtonLabel()}
          </Text>
          {currentStep === 'summary' ? (
            <Check size={16} color="#FFFFFF" strokeWidth={3} style={styles.btnIcon} />
          ) : (
            <ChevronRight size={16} color="#FFFFFF" strokeWidth={3} style={styles.btnIcon} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
    marginRight: 12,
  },
  priceMeta: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceMain: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginTop: 1,
  },
  priceSub: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A', // Luxurious deep navy
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    minHeight: 44,
  },
  actionBtnIncomplete: {
    backgroundColor: '#334155', // Slate indicator when action needs input
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  btnIcon: {
    marginLeft: 4,
  },
});
