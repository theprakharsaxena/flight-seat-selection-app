import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, RotateCcw } from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';
import { StepKey } from '../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showReset?: boolean;
}

const STEP_TITLES: Record<StepKey, { title: string; subtitle: string }> = {
  flight: { title: 'Flight Details', subtitle: 'DEL → BOM • EA 204' },
  passengers: { title: 'Passenger Information', subtitle: 'Select traveler count & details' },
  seats: { title: 'Select Your Seats', subtitle: 'Choose cabin seating' },
  meals: { title: 'Meal Preferences', subtitle: 'Select dining options per passenger' },
  summary: { title: 'Booking Summary', subtitle: 'Review breakdown & total charges' },
};

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  showReset = false,
}) => {
  const { currentStep, prevStep, setPassengerCount, showToast } = useBooking();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      prevStep();
    }
  };

  const handleReset = () => {
    setPassengerCount(2);
    showToast('Reset selection to default', 'info');
  };

  const currentInfo = STEP_TITLES[currentStep];
  const displayTitle = title || currentInfo.title;
  const displaySubtitle = subtitle || currentInfo.subtitle;
  const canGoBack = showBack && currentStep !== 'flight';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftSlot}>
          {canGoBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Back"
            >
              <ArrowLeft size={20} color="#0F172A" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {displayTitle}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {displaySubtitle}
          </Text>
        </View>

        <View style={styles.rightSlot}>
          {showReset && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleReset}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Reset"
            >
              <RotateCcw size={17} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSlot: {
    width: 36,
    justifyContent: 'center',
  },
  rightSlot: {
    width: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
});

