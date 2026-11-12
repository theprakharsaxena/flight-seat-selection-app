import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, X, User } from 'lucide-react-native';

export const SeatLegend: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>SEAT LEGEND & STATUS</Text>

      {/* Primary Seat States */}
      <View style={styles.row}>
        {/* Free / Standard */}
        <View style={styles.legendItem}>
          <View style={[styles.seatSample, styles.seatFree]}>
            <Text style={styles.seatSampleText}>₹0</Text>
          </View>
          <Text style={styles.legendLabel}>Free</Text>
        </View>

        {/* Premium */}
        <View style={styles.legendItem}>
          <View style={[styles.seatSample, styles.seatPremium]}>
            <Text style={styles.seatSampleTextPremium}>₹250</Text>
          </View>
          <Text style={styles.legendLabel}>Premium</Text>
        </View>

        {/* Extra Legroom */}
        <View style={styles.legendItem}>
          <View style={[styles.seatSample, styles.seatLegroom]}>
            <Text style={styles.seatSampleTextLegroom}>₹350</Text>
          </View>
          <Text style={styles.legendLabel}>Legroom</Text>
        </View>
      </View>

      <View style={styles.row}>
        {/* Selected by Active */}
        <View style={styles.legendItem}>
          <View style={[styles.seatSample, styles.seatActive]}>
            <Check size={12} color="#FFFFFF" strokeWidth={3} />
          </View>
          <Text style={styles.legendLabel}>Selected</Text>
        </View>

        {/* Assigned to Other Passenger */}
        <View style={styles.legendItem}>
          <View style={[styles.seatSample, styles.seatOther]}>
            <User size={12} color="#475569" strokeWidth={2.5} />
          </View>
          <Text style={styles.legendLabel}>Assigned</Text>
        </View>

        {/* Occupied */}
        <View style={styles.legendItem}>
          <View style={[styles.seatSample, styles.seatOccupied]}>
            <X size={12} color="#94A3B8" strokeWidth={2.5} />
          </View>
          <Text style={styles.legendLabel}>Occupied</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  seatSample: {
    width: 26,
    height: 26,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  seatFree: {
    backgroundColor: '#F8FAFC',
    borderColor: '#94A3B8',
  },
  seatSampleText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#334155',
  },
  seatPremium: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  seatSampleTextPremium: {
    fontSize: 8,
    fontWeight: '700',
    color: '#4F46E5',
  },
  seatLegroom: {
    backgroundColor: '#FEF3C7',
    borderColor: '#D97706',
  },
  seatSampleTextLegroom: {
    fontSize: 8,
    fontWeight: '700',
    color: '#B45309',
  },
  seatActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  seatOther: {
    backgroundColor: '#E2E8F0',
    borderColor: '#64748B',
    borderStyle: 'dashed',
  },
  seatOccupied: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#334155',
  },
});

