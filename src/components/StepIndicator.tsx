import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';
import { StepKey } from '../types';

interface StepIndicatorProps {
  currentStep: StepKey;
  onSelectStep: (step: StepKey) => void;
}

interface StepItem {
  key: StepKey;
  label: string;
  number: number;
}

const STEPS: StepItem[] = [
  { key: 'flight', label: 'Flight', number: 1 },
  { key: 'passengers', label: 'Passengers', number: 2 },
  { key: 'seats', label: 'Seats', number: 3 },
  { key: 'meals', label: 'Meals', number: 4 },
  { key: 'summary', label: 'Summary', number: 5 },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onSelectStep }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STEPS.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = index < currentIndex;

          return (
            <React.Fragment key={step.key}>
              <TouchableOpacity
                style={[styles.stepItem, isActive && styles.stepItemActive]}
                onPress={() => onSelectStep(step.key)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.circle,
                    isActive && styles.circleActive,
                    isCompleted && styles.circleCompleted,
                  ]}
                >
                  {isCompleted ? (
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <Text
                      style={[
                        styles.numberText,
                        isActive && styles.numberTextActive,
                      ]}
                    >
                      {step.number}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.labelText,
                    isActive && styles.labelTextActive,
                    isCompleted && styles.labelTextCompleted,
                  ]}
                >
                  {step.label}
                </Text>
              </TouchableOpacity>

              {index < STEPS.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    isCompleted && styles.connectorCompleted,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  stepItemActive: {
    backgroundColor: '#F1F5F9',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  circleActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  circleCompleted: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  numberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  numberTextActive: {
    color: '#FFFFFF',
  },
  labelText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  labelTextActive: {
    fontWeight: '700',
    color: '#0F172A',
  },
  labelTextCompleted: {
    color: '#334155',
  },
  connector: {
    width: 16,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  connectorCompleted: {
    backgroundColor: '#059669',
  },
});

