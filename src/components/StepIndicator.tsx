import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Check, Lock } from 'lucide-react-native';
import { StepKey } from '../types';
import { useBooking } from '../context/BookingContext';

interface StepIndicatorProps {
  currentStep: StepKey;
  onSelectStep: (step: StepKey) => void;
}

const STEPS: { key: StepKey; label: string; number: number }[] = [
  { key: 'flight', label: 'Flight', number: 1 },
  { key: 'passengers', label: 'Travelers', number: 2 },
  { key: 'seats', label: 'Seats', number: 3 },
  { key: 'meals', label: 'Meals', number: 4 },
  { key: 'summary', label: 'Summary', number: 5 },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onSelectStep }) => {
  const { canAccessStep } = useBooking();
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STEPS.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = index < currentIndex;
          const isAccessible = isCompleted || isActive || canAccessStep(step.key).allowed;

          return (
            <TouchableOpacity
              key={step.key}
              style={[
                styles.stepChip,
                isActive && styles.stepChipActive,
                isCompleted && styles.stepChipCompleted,
                !isAccessible && styles.stepChipLocked,
              ]}
              onPress={() => onSelectStep(step.key)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.circle,
                  isActive && styles.circleActive,
                  isCompleted && styles.circleCompleted,
                  !isAccessible && styles.circleLocked,
                ]}
              >
                {isCompleted ? (
                  <Check size={10} color="#FFFFFF" strokeWidth={3} />
                ) : !isAccessible ? (
                  <Lock size={8} color="#94A3B8" />
                ) : (
                  <Text style={[styles.circleNum, isActive && styles.circleNumActive]}>
                    {step.number}
                  </Text>
                )}
              </View>

              <Text
                style={[
                  styles.chipLabel,
                  isActive && styles.chipLabelActive,
                  isCompleted && styles.chipLabelCompleted,
                  !isAccessible && styles.chipLabelLocked,
                ]}
              >
                {step.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  stepChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  stepChipCompleted: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  stepChipLocked: {
    opacity: 0.65,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  circleActive: {
    backgroundColor: '#2563EB',
  },
  circleCompleted: {
    backgroundColor: '#059669',
  },
  circleLocked: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  circleNum: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  circleNumActive: {
    color: '#FFFFFF',
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  chipLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chipLabelCompleted: {
    color: '#334155',
  },
  chipLabelLocked: {
    color: '#94A3B8',
  },
});
