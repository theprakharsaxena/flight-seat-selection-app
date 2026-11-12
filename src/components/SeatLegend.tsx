import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Check, X, User } from 'lucide-react-native';

export const SeatLegend: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Free */}
        <View style={styles.legendItem}>
          <View style={[styles.sampleBox, styles.sampleFree]}>
            <Text style={styles.sampleTextFree}>₹0</Text>
          </View>
          <Text style={styles.legendLabel}>Standard (Free)</Text>
        </View>

        {/* Premium */}
        <View style={styles.legendItem}>
          <View style={[styles.sampleBox, styles.samplePremium]}>
            <Text style={styles.sampleTextPremium}>₹250</Text>
          </View>
          <Text style={styles.legendLabel}>Premium</Text>
        </View>

        {/* Extra Legroom */}
        <View style={styles.legendItem}>
          <View style={[styles.sampleBox, styles.sampleLegroom]}>
            <Text style={styles.sampleTextLegroom}>₹350</Text>
          </View>
          <Text style={styles.legendLabel}>Extra Legroom</Text>
        </View>

        {/* Selected */}
        <View style={styles.legendItem}>
          <View style={[styles.sampleBox, styles.sampleActive]}>
            <Check size={10} color="#FFFFFF" strokeWidth={3} />
          </View>
          <Text style={styles.legendLabel}>Selected</Text>
        </View>

        {/* Assigned */}
        <View style={styles.legendItem}>
          <View style={[styles.sampleBox, styles.sampleOther]}>
            <User size={10} color="#475569" strokeWidth={2.5} />
          </View>
          <Text style={styles.legendLabel}>Assigned</Text>
        </View>

        {/* Occupied */}
        <View style={styles.legendItem}>
          <View style={[styles.sampleBox, styles.sampleOccupied]}>
            <X size={10} color="#94A3B8" strokeWidth={2.5} />
          </View>
          <Text style={styles.legendLabel}>Occupied</Text>
        </View>
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
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  sampleBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  sampleFree: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
  },
  sampleTextFree: {
    fontSize: 8,
    fontWeight: '700',
    color: '#334155',
  },
  samplePremium: {
    backgroundColor: '#FAF5FF',
    borderColor: '#7C3AED',
  },
  sampleTextPremium: {
    fontSize: 7,
    fontWeight: '800',
    color: '#7C3AED',
  },
  sampleLegroom: {
    backgroundColor: '#FFFBEB',
    borderColor: '#D97706',
  },
  sampleTextLegroom: {
    fontSize: 7,
    fontWeight: '800',
    color: '#B45309',
  },
  sampleActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  sampleOther: {
    backgroundColor: '#F8FAFC',
    borderColor: '#64748B',
    borderStyle: 'dashed',
  },
  sampleOccupied: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
});
