import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, RotateCcw } from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';
import { StepKey } from '../types';

interface HeaderProps {
  onBack?: () => void;
}

const STEPS_DATA: { key: StepKey; title: string; stepNumber: number }[] = [
  { key: 'flight', title: 'Flight Details', stepNumber: 1 },
  { key: 'passengers', title: 'Passengers', stepNumber: 2 },
  { key: 'seats', title: 'Select Seats', stepNumber: 3 },
  { key: 'meals', title: 'Meals', stepNumber: 4 },
  { key: 'summary', title: 'Review & Pay', stepNumber: 5 },
];

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
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

  const currentStepData = STEPS_DATA.find((s) => s.key === currentStep) || STEPS_DATA[0];
  const canGoBack = currentStep !== 'flight';
  const progressPercent = (currentStepData.stepNumber / STEPS_DATA.length) * 100;

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.navRow}>
        <View style={styles.leftSlot}>
          {canGoBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
              accessibilityLabel="Back"
            >
              <ArrowLeft size={18} color="#0F172A" strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSlot}>
          <Text style={styles.flightTag}>EA 204 • DEL → BOM</Text>
          <Text style={styles.screenTitle}>{currentStepData.title}</Text>
        </View>

        <View style={styles.rightSlot}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            accessibilityLabel="Reset"
          >
            <RotateCcw size={15} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Slim Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
  },
  leftSlot: {
    width: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSlot: {
    width: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flightTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginTop: 1,
  },
  progressTrack: {
    height: 2.5,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 1.5,
  },
});
