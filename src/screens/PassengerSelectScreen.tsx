import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Plus,
  Minus,
  Armchair,
  Utensils,
  UserCheck,
  Pencil,
  Trash2,
  X,
  Check,
  UserPlus,
} from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';
import { Passenger } from '../types';

export const PassengerSelectScreen: React.FC = () => {
  const {
    state,
    validPassengers,
    activePassenger,
    setActivePassengerId,
    setPassengerCount,
    getSeatForPassenger,
    updatePassengerName,
    removePassenger,
    showToast,
  } = useBooking();

  const { passengerCount, activeLayout, mealSelections } = state;

  // Edit Name Modal State
  const [editingPassenger, setEditingPassenger] = useState<Passenger | null>(null);
  const [editedName, setEditedName] = useState<string>('');

  const handleIncrement = () => {
    if (passengerCount < 6) setPassengerCount(passengerCount + 1);
  };

  const handleDecrement = () => {
    if (passengerCount > 1) setPassengerCount(passengerCount - 1);
  };

  const handleOpenEdit = (pax: Passenger, e: any) => {
    e.stopPropagation();
    setEditingPassenger(pax);
    setEditedName(pax.name);
  };

  const handleSaveEdit = () => {
    if (!editingPassenger) return;
    updatePassengerName(editingPassenger.id, editedName);
    setEditingPassenger(null);
  };

  const handleDeletePassenger = (pax: Passenger, e: any) => {
    e.stopPropagation();
    removePassenger(pax.id);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Traveler Count Stepper Card */}
      <View style={styles.counterCard}>
        <View style={styles.counterTop}>
          <View style={styles.counterTextCol}>
            <Text style={styles.counterTitle}>Number of Travelers</Text>
            <Text style={styles.counterSubtitle}>
              Select between 1 and 6 passengers
            </Text>
          </View>

          {/* Stepper Buttons */}
          <View style={styles.stepperControl}>
            <TouchableOpacity
              style={[styles.stepperBtn, passengerCount <= 1 && styles.stepperBtnDisabled]}
              onPress={handleDecrement}
              disabled={passengerCount <= 1}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
              accessibilityLabel="Decrease passenger count"
            >
              <Minus
                size={16}
                color={passengerCount <= 1 ? '#CBD5E1' : '#0F172A'}
                strokeWidth={2.5}
              />
            </TouchableOpacity>

            <View style={styles.stepperNumBox}>
              <Text style={styles.stepperNumText}>{passengerCount}</Text>
            </View>

            <TouchableOpacity
              style={[styles.stepperBtn, passengerCount >= 6 && styles.stepperBtnDisabled]}
              onPress={handleIncrement}
              disabled={passengerCount >= 6}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
              accessibilityLabel="Increase passenger count"
            >
              <Plus
                size={16}
                color={passengerCount >= 6 ? '#CBD5E1' : '#0F172A'}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Numerical Pills */}
        <View style={styles.pillRow}>
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const isSelected = passengerCount === num;
            return (
              <TouchableOpacity
                key={num}
                style={[styles.quickPill, isSelected && styles.quickPillActive]}
                onPress={() => setPassengerCount(num)}
                activeOpacity={0.7}
              >
                <Text style={[styles.quickPillText, isSelected && styles.quickPillTextActive]}>
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Roster Section Header */}
      <View style={styles.rosterHeader}>
        <Text style={styles.rosterTitle}>TRAVELER ROSTER ({validPassengers.length})</Text>
        <Text style={styles.rosterSub}>
          Tap any card to set active, or tap edit/delete icons
        </Text>
      </View>

      {/* Traveler Cards */}
      {validPassengers.map((passenger, index) => {
        const isActive = passenger.id === activePassenger.id;
        const assignedSeat = getSeatForPassenger(passenger.id, activeLayout);
        const mealId = mealSelections[passenger.id];
        const hasMeal = mealId && mealId !== 'meal-none';

        return (
          <TouchableOpacity
            key={passenger.id}
            style={[styles.travelerCard, isActive && styles.travelerCardActive]}
            onPress={() => setActivePassengerId(passenger.id)}
            activeOpacity={0.8}
          >
            {/* Top Info Row */}
            <View style={styles.travelerTopRow}>
              <View
                style={[
                  styles.avatarCircle,
                  { backgroundColor: passenger.avatarColor || '#2563EB' },
                ]}
              >
                <Text style={styles.avatarInitials}>
                  {passenger.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)}
                </Text>
              </View>

              <View style={styles.travelerDetails}>
                <View style={styles.nameRow}>
                  <Text style={[styles.travelerName, isActive && styles.travelerNameActive]}>
                    {passenger.name}
                  </Text>
                  {isActive && (
                    <View style={styles.activePill}>
                      <UserCheck size={10} color="#1E40AF" strokeWidth={2.5} />
                      <Text style={styles.activePillText}>Active</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.travelerMeta}>
                  Traveler {index + 1} • {passenger.code}
                </Text>
              </View>

              {/* Action Buttons: Edit and Delete */}
              <View style={styles.actionButtonsCol}>
                <TouchableOpacity
                  style={styles.iconActionBtn}
                  onPress={(e) => handleOpenEdit(passenger, e)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel={`Edit ${passenger.name}`}
                >
                  <Pencil size={14} color="#475569" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.iconActionBtn,
                    styles.iconActionBtnDelete,
                    passengerCount <= 1 && styles.iconActionBtnDisabled,
                  ]}
                  onPress={(e) => handleDeletePassenger(passenger, e)}
                  disabled={passengerCount <= 1}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel={`Delete ${passenger.name}`}
                >
                  <Trash2
                    size={14}
                    color={passengerCount <= 1 ? '#CBD5E1' : '#EF4444'}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Selection Badges */}
            <View style={styles.badgesRow}>
              {/* Seat Badge */}
              <View
                style={[
                  styles.badgePill,
                  assignedSeat ? styles.badgePillAssigned : styles.badgePillEmpty,
                ]}
              >
                <Armchair
                  size={12}
                  color={assignedSeat ? '#0F172A' : '#94A3B8'}
                  style={styles.badgeIcon}
                />
                <Text
                  style={[
                    styles.badgeText,
                    assignedSeat && styles.badgeTextAssigned,
                  ]}
                >
                  {assignedSeat
                    ? `Seat ${assignedSeat.id} (${assignedSeat.price === 0 ? 'Free' : `₹${assignedSeat.price}`})`
                    : 'No Seat Selected'}
                </Text>
              </View>

              {/* Meal Badge */}
              <View
                style={[
                  styles.badgePill,
                  hasMeal ? styles.badgePillAssigned : styles.badgePillEmpty,
                ]}
              >
                <Utensils
                  size={12}
                  color={hasMeal ? '#059669' : '#94A3B8'}
                  style={styles.badgeIcon}
                />
                <Text
                  style={[
                    styles.badgeText,
                    hasMeal && styles.badgeTextMeal,
                  ]}
                >
                  {hasMeal ? 'Meal Chosen' : 'No Meal'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Add Another Passenger Button (when count < 6) */}
      {passengerCount < 6 && (
        <TouchableOpacity
          style={styles.addPassengerRowBtn}
          onPress={handleIncrement}
          activeOpacity={0.8}
        >
          <UserPlus size={16} color="#2563EB" style={styles.addIcon} />
          <Text style={styles.addPassengerText}>
            Add Another Traveler ({6 - passengerCount} spots remaining)
          </Text>
        </TouchableOpacity>
      )}

      {/* Edit Passenger Name Modal */}
      <Modal
        visible={editingPassenger !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditingPassenger(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Pencil size={16} color="#0F172A" />
                <Text style={styles.modalTitle}>Edit Passenger Name</Text>
              </View>
              <TouchableOpacity
                onPress={() => setEditingPassenger(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalInputLabel}>Full Name</Text>
            <TextInput
              style={styles.nameTextInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter traveler full name"
              placeholderTextColor="#94A3B8"
              autoFocus={true}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSaveEdit}
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditingPassenger(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveEdit}
                activeOpacity={0.85}
              >
                <Check size={16} color="#FFFFFF" strokeWidth={2.5} style={styles.saveIco} />
                <Text style={styles.modalSaveText}>Save Name</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  counterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  counterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  counterTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  counterTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  counterSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 3,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  stepperNumBox: {
    width: 28,
    alignItems: 'center',
  },
  stepperNumText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  quickPill: {
    flex: 1,
    height: 34,
    marginHorizontal: 2.5,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  quickPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  quickPillTextActive: {
    color: '#FFFFFF',
  },
  rosterHeader: {
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  rosterTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  rosterSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 1,
  },
  travelerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  travelerCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFC',
  },
  travelerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitials: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  travelerDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  travelerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  travelerNameActive: {
    color: '#1E40AF',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginLeft: 6,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E40AF',
    marginLeft: 2,
  },
  travelerMeta: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  actionButtonsCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconActionBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  iconActionBtnDelete: {
    backgroundColor: '#FEE2E2',
  },
  iconActionBtnDisabled: {
    backgroundColor: '#F1F5F9',
    opacity: 0.4,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
  },
  badgePillAssigned: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  badgePillEmpty: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E2E8F0',
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
  },
  badgeTextAssigned: {
    color: '#0F172A',
    fontWeight: '700',
  },
  badgeTextMeal: {
    color: '#059669',
    fontWeight: '700',
  },
  addPassengerRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  addIcon: {
    marginRight: 6,
  },
  addPassengerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 6,
  },
  modalInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  nameTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveIco: {
    marginRight: 4,
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
