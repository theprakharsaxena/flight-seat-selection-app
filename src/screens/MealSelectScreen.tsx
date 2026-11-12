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
        return <Coffee size={18} color="#64748B" />;
      case 'meal-veg':
        return <Leaf size={18} color="#059669" />;
      case 'meal-nonveg':
        return <Drumstick size={18} color="#DC2626" />;
      case 'meal-vegan':
        return <Sparkles size={18} color="#0D9488" />;
      case 'meal-jain':
        return <ShieldAlert size={18} color="#D97706" />;
      default:
        return <Utensils size={18} color="#2563EB" />;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Passenger Selection Header */}
      <View style={styles.paxHeaderSection}>
        <Text style={styles.sectionTitle}>SELECTING MEAL FOR PASSENGER</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paxScroll}
        >
          {validPassengers.map((pax) => {
            const isActive = pax.id === activePassenger.id;
            const paxSummary = passengerSummaries.find((s) => s.passenger.id === pax.id);
            const selectedMeal = paxSummary?.meal;

            return (
              <TouchableOpacity
                key={pax.id}
                style={[styles.paxTab, isActive && styles.paxTabActive]}
                onPress={() => setActivePassengerId(pax.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.paxAvatar,
                    { backgroundColor: pax.avatarColor || '#2563EB' },
                  ]}
                >
                  <Text style={styles.paxAvatarText}>
                    {pax.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)}
                  </Text>
                </View>
                <View style={styles.paxInfoCol}>
                  <Text style={[styles.paxTabName, isActive && styles.paxTabNameActive]}>
                    {pax.name.split(' ')[0]}
                  </Text>
                  <Text style={styles.paxTabMealName} numberOfLines={1}>
                    {selectedMeal?.price === 0 ? 'No Meal' : selectedMeal?.name.replace(' Meal', '')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Passenger Title Banner */}
      <View style={styles.activeNotice}>
        <Text style={styles.activeNoticeTitle}>
          In-flight Dining for {activePassenger.name}
        </Text>
        <Text style={styles.activeNoticeSub}>
          Meals are prepared fresh and served along with beverage service after departure.
        </Text>
      </View>

      {/* List of Meal Options */}
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
              <View style={styles.mealTopRow}>
                {/* Meal Icon */}
                <View
                  style={[
                    styles.mealIconBox,
                    isSelected && styles.mealIconBoxActive,
                  ]}
                >
                  {getDietaryIcon(meal)}
                </View>

                {/* Meal Title & Dietary Tag */}
                <View style={styles.mealTitleBox}>
                  <View style={styles.titleWithTag}>
                    <Text style={[styles.mealName, isSelected && styles.mealNameActive]}>
                      {meal.name}
                    </Text>
                    {meal.dietaryTag && (
                      <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>{meal.dietaryTag}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.mealDescription}>{meal.description}</Text>
                </View>

                {/* Price & Selection Checkmark */}
                <View style={styles.priceColumn}>
                  <Text style={[styles.mealPriceText, isSelected && styles.mealPriceTextActive]}>
                    {meal.price === 0 ? 'Free' : `₹${meal.price}`}
                  </Text>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                    ]}
                  >
                    {isSelected && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
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
  paxHeaderSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 2,
  },
  paxScroll: {
    paddingVertical: 2,
  },
  paxTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    minWidth: 125,
  },
  paxTabActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  paxAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  paxAvatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  paxInfoCol: {
    flex: 1,
  },
  paxTabName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  paxTabNameActive: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  paxTabMealName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  activeNotice: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeNoticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  activeNoticeSub: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  mealList: {
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  mealCardActive: {
    borderColor: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  mealTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mealIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealIconBoxActive: {
    backgroundColor: '#E2E8F0',
  },
  mealTitleBox: {
    flex: 1,
    paddingRight: 8,
  },
  titleWithTag: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  mealName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  mealNameActive: {
    color: '#0F172A',
  },
  tagBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  mealDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
  priceColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 46,
  },
  mealPriceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  mealPriceTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  radioCircleActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
});

