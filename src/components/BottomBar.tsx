import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, ChevronRight, Check } from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';

interface BottomBarProps {
  primaryLabel?: string;
  onPressPrimary?: () => void;
  secondaryLabel?: string;
  onPressSecondary?: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  primaryLabel,
  onPressPrimary,
  secondaryLabel,
  onPressSecondary,
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
  } = useBooking();

  const activeSeats = state.seatAssignments[state.activeLayout];
  const assignedSeatCount = validPassengers.filter((p) => Boolean(activeSeats[p.id])).length;
  const totalPax = validPassengers.length;

  const getDefaultButtonLabel = () => {
    switch (currentStep) {
      case 'flight':
        return 'Select Passengers';
      case 'passengers':
        return 'Choose Seats';
      case 'seats':
        return assignedSeatCount === totalPax
          ? 'Proceed to Meals'
          : `Proceed to Meals (${assignedSeatCount}/${totalPax} Seats)`;
      case 'meals':
        return 'Review Summary';
      case 'summary':
        return 'Confirm Selection';
      default:
        return 'Continue';
    }
  };

  const handlePrimaryPress = () => {
    if (onPressPrimary) {
      onPressPrimary();
    } else {
      nextStep();
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <View style={styles.content}>
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <Text style={styles.priceValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
          <Text style={styles.breakdownText}>
            Seats: ₹{totalSeatCharges} • Meals: ₹{totalMealCharges}
          </Text>
        </View>

        <View style={styles.actionSection}>
          {secondaryLabel && onPressSecondary && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onPressSecondary}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>{secondaryLabel}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handlePrimaryPress}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              {primaryLabel || getDefaultButtonLabel()}
            </Text>
            {currentStep === 'summary' ? (
              <Check size={18} color="#FFFFFF" strokeWidth={2.5} style={styles.icon} />
            ) : (
              <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.5} style={styles.icon} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceSection: {
    flex: 1,
    marginRight: 12,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginTop: 1,
  },
  breakdownText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A', // Sleek deep navy
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 10,
    minHeight: 46,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  icon: {
    marginLeft: 6,
  },
});

