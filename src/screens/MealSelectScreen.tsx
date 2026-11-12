import React, { useEffect } from 'react';
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
  } = useBooking();

  const { mealSelections } = state;
  const currentMealId = mealSelections[activePassenger.id] || 'meal-none';
  const activeMeal = MEAL_OPTIONS.find((m) => m.id === currentMealId) || MEAL_OPTIONS[0];

  // Default to the first passenger upon entering the meals screen
  useEffect(() => {
    if (validPassengers.length > 0) {
      setActivePassengerId(validPassengers[0].id);
    }
  }, []);

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
        <Text style={styles.sectionTitle}>SELECT TRAVELER TO ASSIGN MEAL</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.travelerScroll}
        >
          {validPassengers.map((pax) => {
            const isActive = pax.id === activePassenger.id;
            const paxMealId = mealSelections[pax.id] || 'meal-none';
            const paxMeal = MEAL_OPTIONS.find((m) => m.id === paxMealId) || MEAL_OPTIONS[0];

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
                  <Text style={[styles.paxChipMeal, isActive && styles.paxChipMealActive]} numberOfLines={1}>
                    {paxMeal.price === 0 ? 'No meal' : `${paxMeal.name.replace(' Meal', '')} (₹${paxMeal.price})`}
                  </Text>
                </View>

                {isActive && (
                  <View style={styles.activeDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Traveler Dining Header Card */}
      <View style={styles.menuNoticeCard}>
        <View style={styles.menuNoticeTop}>
          <View style={styles.menuNoticeLeft}>
            <Text style={styles.menuNoticeSubtitle}>SELECTING DINING FOR</Text>
            <Text style={styles.menuNoticeTitle}>
              {activePassenger.name}
            </Text>
          </View>
          <View style={[styles.activeStatusPill, activeMeal.price > 0 && styles.activeStatusPillPaid]}>
            <Check size={11} color={activeMeal.price > 0 ? '#1D4ED8' : '#059669'} strokeWidth={3} />
            <Text style={[styles.activeStatusText, activeMeal.price > 0 && styles.activeStatusTextPaid]}>
              {activeMeal.price === 0 ? 'Complimentary' : `₹${activeMeal.price}`}
            </Text>
          </View>
        </View>

        <View style={styles.selectedMealSummaryRow}>
          <Text style={styles.selectedMealSummaryLabel}>Current Meal:</Text>
          <Text style={styles.selectedMealSummaryName}>
            {activeMeal.name}
          </Text>
        </View>
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

                  {isSelected && (
                    <View style={styles.selectedBadgeRow}>
                      <View style={styles.selectedPillBadge}>
                        <Check size={10} color="#FFFFFF" strokeWidth={3} />
                        <Text style={styles.selectedPillText}>
                          Selected for {activePassenger.name.split(' ')[0]}
                        </Text>
                      </View>
                    </View>
                  )}
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
  paxChipMealActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginLeft: 4,
  },
  menuNoticeCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuNoticeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuNoticeLeft: {
    flex: 1,
    marginRight: 8,
  },
  menuNoticeSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  menuNoticeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  activeStatusPillPaid: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  activeStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 4,
  },
  activeStatusTextPaid: {
    color: '#1D4ED8',
  },
  selectedMealSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  selectedMealSummaryLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  selectedMealSummaryName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 6,
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
  selectedBadgeRow: {
    marginTop: 6,
  },
  selectedPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  selectedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
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
