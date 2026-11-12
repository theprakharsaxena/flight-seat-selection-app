import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import {
  Plane,
  Armchair,
  Utensils,
  CheckCircle,
  Receipt,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react-native';
import { useBooking } from '../context/BookingContext';

export const BookingSummaryScreen: React.FC = () => {
  const {
    state,
    passengerSummaries,
    totalSeatCharges,
    totalMealCharges,
    totalAmount,
    setCurrentStep,
    resetBooking,
    isBookingConfirmed,
    confirmBooking,
    dismissConfirmation,
  } = useBooking();

  const { flight, activeLayout, passengerCount } = state;
  const layoutTitle = activeLayout === '3-2' ? '3–2 Single Aisle' : '2–3–2 Wide-Body';

  const handleFinishBooking = () => {
    confirmBooking();
  };

  const handleResetAll = () => {
    dismissConfirmation();
    resetBooking();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Flight Itinerary Card */}
      <View style={styles.itineraryCard}>
        <View style={styles.itineraryHeader}>
          <View style={styles.airlineBadge}>
            <Plane size={14} color="#2563EB" />
            <Text style={styles.airlineName}>{flight.airline}</Text>
          </View>
          <Text style={styles.flightCode}>{flight.flightNumber}</Text>
        </View>

        <View style={styles.routeRow}>
          <View>
            <Text style={styles.routeCity}>{flight.origin.city} ({flight.origin.code})</Text>
            <Text style={styles.routeTime}>{flight.departureTime}</Text>
          </View>
          <View style={styles.durationPill}>
            <Text style={styles.durationPillText}>{flight.duration}</Text>
            <ArrowRight size={14} color="#64748B" />
          </View>
          <View style={styles.routeRight}>
            <Text style={styles.routeCity}>{flight.destination.city} ({flight.destination.code})</Text>
            <Text style={styles.routeTime}>{flight.arrivalTime}</Text>
          </View>
        </View>

        <View style={styles.cabinMetaRow}>
          <Text style={styles.cabinMetaLabel}>Cabin Configuration</Text>
          <Text style={styles.cabinMetaValue}>{layoutTitle}</Text>
        </View>
      </View>

      {/* Passenger Breakdown Header */}
      <View style={styles.breakdownHeader}>
        <Text style={styles.breakdownTitle}>PASSENGERS & SELECTIONS ({passengerCount})</Text>
        <TouchableOpacity
          onPress={() => setCurrentStep('seats')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.modifyText}>Edit Seats</Text>
        </TouchableOpacity>
      </View>

      {/* Itemized Passenger Cards */}
      {passengerSummaries.map((item, index) => {
        const { passenger, seat, seatPrice, meal, mealPrice, totalPassengerCost } = item;
        const seatCategoryLabel = seat
          ? seat.category === 'extra_legroom'
            ? 'Extra Legroom'
            : seat.category === 'premium'
            ? 'Premium'
            : 'Standard'
          : 'No Seat';

        return (
          <View key={passenger.id} style={styles.paxCard}>
            <View style={styles.paxCardHeader}>
              <View style={styles.paxCardLeft}>
                <View
                  style={[
                    styles.avatarMini,
                    { backgroundColor: passenger.avatarColor || '#2563EB' },
                  ]}
                >
                  <Text style={styles.avatarMiniText}>
                    {passenger.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.paxName}>{passenger.name}</Text>
                  <Text style={styles.paxMeta}>{passenger.code} • Traveler {index + 1}</Text>
                </View>
              </View>

              <Text style={styles.paxTotalCost}>
                ₹{totalPassengerCost.toLocaleString('en-IN')}
              </Text>
            </View>

            {/* Seat Line */}
            <View style={styles.lineItem}>
              <View style={styles.lineLeft}>
                <Armchair size={14} color="#64748B" style={styles.lineIcon} />
                <View>
                  <Text style={styles.lineMain}>
                    {seat ? `Seat ${seat.id}` : 'No seat allocated'}
                  </Text>
                  <Text style={styles.lineSub}>{seatCategoryLabel}</Text>
                </View>
              </View>
              <Text style={styles.linePrice}>
                {seatPrice === 0 ? '₹0' : `₹${seatPrice}`}
              </Text>
            </View>

            {/* Meal Line */}
            <View style={[styles.lineItem, styles.lineBorderTop]}>
              <View style={styles.lineLeft}>
                <Utensils size={14} color="#64748B" style={styles.lineIcon} />
                <View>
                  <Text style={styles.lineMain}>{meal.name}</Text>
                  <Text style={styles.lineSub}>{meal.dietaryTag || 'Dining'}</Text>
                </View>
              </View>
              <Text style={styles.linePrice}>
                {mealPrice === 0 ? '₹0' : `₹${mealPrice}`}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Charges Breakdown Receipt Card */}
      <View style={styles.receiptCard}>
        <View style={styles.receiptHeader}>
          <Receipt size={16} color="#0F172A" />
          <Text style={styles.receiptTitle}>FARE & CHARGES BREAKDOWN</Text>
        </View>

        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Seat Selection ({passengerCount} travelers)</Text>
          <Text style={styles.receiptValue}>₹{totalSeatCharges.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>In-flight Meals ({passengerCount} meals)</Text>
          <Text style={styles.receiptValue}>₹{totalMealCharges.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.receiptDivider} />

        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.taxSub}>All applicable taxes included</Text>
          </View>
          <Text style={styles.grandTotalValue}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Confirmation CTA */}
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={handleFinishBooking}
        activeOpacity={0.85}
      >
        <ShieldCheck size={18} color="#FFFFFF" style={styles.confirmIcon} />
        <Text style={styles.confirmBtnText}>Confirm Selection</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        visible={isBookingConfirmed}
        transparent={true}
        animationType="fade"
        onRequestClose={dismissConfirmation}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalCheckCircle}>
              <CheckCircle size={36} color="#059669" />
            </View>

            <Text style={styles.modalHeading}>Seat Selection Confirmed</Text>
            <Text style={styles.modalRefText}>
              Reference Code: EA-784291
            </Text>

            <View style={styles.modalDataBox}>
              <View style={styles.modalRow}>
                <Text style={styles.modalRowKey}>Flight</Text>
                <Text style={styles.modalRowVal}>DEL → BOM (EA 204)</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalRowKey}>Travelers</Text>
                <Text style={styles.modalRowVal}>{passengerCount} Passengers</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalRowKey}>Cabin</Text>
                <Text style={styles.modalRowVal}>{layoutTitle}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalRowKey}>Total</Text>
                <Text style={styles.modalRowValBold}>
                  ₹{totalAmount.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <Text style={styles.modalFootnote}>
              Mock technical assessment confirmation. No payment was charged.
            </Text>

            <TouchableOpacity
              style={styles.modalDismissBtn}
              onPress={handleResetAll}
              activeOpacity={0.85}
            >
              <RotateCcw size={15} color="#FFFFFF" style={styles.resetIco} />
              <Text style={styles.modalDismissText}>Start New Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingBottom: 28,
  },
  itineraryCard: {
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
  itineraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
    marginBottom: 10,
  },
  airlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 6,
  },
  flightCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeRight: {
    alignItems: 'flex-end',
  },
  routeCity: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  routeTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  durationPill: {
    alignItems: 'center',
  },
  durationPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  cabinMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  cabinMetaLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  cabinMetaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  breakdownTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  modifyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  paxCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 8,
  },
  paxCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
    marginBottom: 8,
  },
  paxCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarMiniText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  paxName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  paxMeta: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  paxTotalCost: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  lineBorderTop: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 6,
  },
  lineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineIcon: {
    marginRight: 8,
  },
  lineMain: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  lineSub: {
    fontSize: 10,
    fontWeight: '400',
    color: '#64748B',
  },
  linePrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
    marginTop: 8,
    marginBottom: 14,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  receiptLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  taxSub: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 13,
    borderRadius: 10,
  },
  confirmIcon: {
    marginRight: 6,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  modalCheckCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalRefText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 3,
    marginBottom: 14,
  },
  modalDataBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    width: '100%',
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  modalRowKey: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  modalRowVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalRowValBold: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalFootnote: {
    fontSize: 10,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
  },
  modalDismissBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
  },
  resetIco: {
    marginRight: 6,
  },
  modalDismissText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
