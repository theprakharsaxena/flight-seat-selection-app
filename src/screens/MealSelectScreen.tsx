import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Utensils,
  Check,
  Leaf,
  Drumstick,
  ShieldAlert,
  Coffee,
  Sparkles,
} from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';
import { MEAL_OPTIONS } from '../data/mealData';
import { MealOption } from '../types';

export const MealSelectScreen: React.FC = () => {
  const {
    validPassengers,
    activePassenger,
    setActivePassengerId,
    selectMeal,
    state,
    passengerSummaries,
  } = useBooking();

  const { mealSelections } = state;
  const currentMealId = mealSelections[activePassenger.id] || 'meal-none';

  const getDietaryIcon = (meal: MealOption) => {
    switch (meal.id) {
      case 'meal-none':
        return <Coffee size={16} color="#64748B" />;
      case 'meal-veg':
        return <Leaf size={16} color="#059669" />;
      case 'meal-nonveg':
        return <Drumstick size={16} color="#DC2626" />;
      case 'meal-vegan':
        return <Sparkles size={16} color="#0D9488" />;
      case 'meal-jain':
        return <ShieldAlert size={16} color="#D97706" />;
      default:
        return <Utensils size={16} color="#2563EB" />;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Traveler Selector Strip */}
      <View style={styles.travelerHeader}>
        <Text style={styles.sectionTitle}>SELECTING MEAL FOR</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.travelerScroll}
        >
          {validPassengers.map((pax) => {
            const isActive = pax.id === activePassenger.id;
            const paxSummary = passengerSummaries.find((s) => s.passenger.id === pax.id);
            const selectedMeal = paxSummary?.meal;

            return (
              <TouchableOpacity
                key={pax.id}
                style={[styles.paxChip, isActive && styles.paxChipActive]}
                onPress={() => setActivePassengerId(pax.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.avatarMini,
                    { backgroundColor: pax.avatarColor || '#2563EB' },
                  ]}
                >
                  <Text style={styles.avatarMiniText}>
                    {pax.name.charAt(0)}
                  </Text>
                </View>

                <View style={styles.paxChipTextCol}>
                  <Text style={[styles.paxChipName, isActive && styles.paxChipNameActive]}>
                    {pax.name.split(' ')[0]}
                  </Text>
                  <Text style={styles.paxChipMeal} numberOfLines={1}>
                    {selectedMeal?.price === 0 ? 'No meal' : selectedMeal?.name.replace(' Meal', '')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Menu Header Card */}
      <View style={styles.menuNoticeCard}>
        <Text style={styles.menuNoticeTitle}>
          Dining Options for {activePassenger.name}
        </Text>
        <Text style={styles.menuNoticeSub}>
          Pre-ordered meals are served hot with beverage service after departure.
        </Text>
      </View>

      {/* Meal Option Cards */}
      <View style={styles.mealList}>
        {MEAL_OPTIONS.map((meal) => {
          const isSelected = currentMealId === meal.id;

          return (
            <TouchableOpacity
              key={meal.id}
              style={[styles.mealCard, isSelected && styles.mealCardActive]}
              onPress={() => selectMeal(meal.id, activePassenger.id)}
              activeOpacity={0.85}
            >
              <View style={styles.mealMainRow}>
                <View
                  style={[
                    styles.mealIconCircle,
                    isSelected && styles.mealIconCircleActive,
                  ]}
                >
                  {getDietaryIcon(meal)}
                </View>

                <View style={styles.mealTextBody}>
                  <View style={styles.nameAndTagRow}>
                    <Text style={[styles.mealName, isSelected && styles.mealNameActive]}>
                      {meal.name}
                    </Text>
                    {meal.dietaryTag && (
                      <View style={styles.dietaryTagBadge}>
                        <Text style={styles.dietaryTagText}>{meal.dietaryTag}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.mealDesc}>{meal.description}</Text>
                </View>

                <View style={styles.priceCol}>
                  <Text style={[styles.priceTag, isSelected && styles.priceTagActive]}>
                    {meal.price === 0 ? 'Free' : `₹${meal.price}`}
                  </Text>
                  <View
                    style={[
                      styles.radioPill,
                      isSelected && styles.radioPillActive,
                    ]}
                  >
                    {isSelected && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  travelerHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginLeft: 2,
  },
  travelerScroll: {
    paddingVertical: 2,
  },
  paxChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 6,
    minWidth: 110,
  },
  paxChipActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  avatarMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  avatarMiniText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  paxChipTextCol: {
    flex: 1,
  },
  paxChipName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  paxChipNameActive: {
    color: '#1E40AF',
    fontWeight: '800',
  },
  paxChipMeal: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  menuNoticeCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuNoticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  menuNoticeSub: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  mealList: {
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  mealCardActive: {
    borderColor: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  mealMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mealIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  mealIconCircleActive: {
    backgroundColor: '#E2E8F0',
  },
  mealTextBody: {
    flex: 1,
    paddingRight: 6,
  },
  nameAndTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  mealName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  mealNameActive: {
    color: '#0F172A',
  },
  dietaryTagBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dietaryTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  mealDesc: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 3,
    lineHeight: 15,
  },
  priceCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 42,
  },
  priceTag: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  priceTagActive: {
    color: '#0F172A',
    fontWeight: '900',
  },
  radioPill: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },
  radioPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
});
