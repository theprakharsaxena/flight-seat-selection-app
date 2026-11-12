import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import {
  Plane,
  Armchair,
  Utensils,
  CheckCircle,
  Receipt,
  RotateCcw,
  User,
  ShieldCheck,
  Check,
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
    setPassengerCount,
  } = useBooking();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { flight, activeLayout, passengerCount } = state;

  const layoutTitle = activeLayout === '3-2' ? '3–2 Single Aisle' : '2–3–2 Twin Aisle';

  const handleFinishBooking = () => {
    setShowConfirmModal(true);
  };

  const handleResetAll = () => {
    setShowConfirmModal(false);
    setPassengerCount(2);
    setCurrentStep('flight');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Flight Header Receipt Banner */}
      <View style={styles.flightSummaryCard}>
        <View style={styles.airlineRow}>
          <View style={styles.airlineBadge}>
            <Plane size={15} color="#2563EB" />
            <Text style={styles.airlineName}>{flight.airline}</Text>
          </View>
          <Text style={styles.flightCode}>{flight.flightNumber}</Text>
        </View>

        <View style={styles.routeRow}>
          <View>
            <Text style={styles.cityText}>{flight.origin.city} ({flight.origin.code})</Text>
            <Text style={styles.timeText}>{flight.departureTime}</Text>
          </View>
          <View style={styles.routeArrowBox}>
            <Text style={styles.durationBadge}>{flight.duration}</Text>
            <ArrowRight size={16} color="#64748B" />
          </View>
          <View style={styles.routeRight}>
            <Text style={styles.cityText}>{flight.destination.city} ({flight.destination.code})</Text>
            <Text style={styles.timeText}>{flight.arrivalTime}</Text>
          </View>
        </View>

        <View style={styles.layoutNoticeRow}>
          <Text style={styles.layoutNoticeLabel}>Selected Cabin Layout:</Text>
          <Text style={styles.layoutNoticeValue}>{layoutTitle}</Text>
        </View>
      </View>

      {/* Passenger Breakdown Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PASSENGER BREAKDOWN ({passengerCount})</Text>
        <TouchableOpacity
          onPress={() => setCurrentStep('seats')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.modifyLink}>Modify Seats</Text>
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
          : 'None';

        return (
          <View key={passenger.id} style={styles.passengerCard}>
            {/* Passenger Title Row */}
            <View style={styles.cardHeader}>
              <View style={styles.paxTitleLeft}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: passenger.avatarColor || '#2563EB' },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {passenger.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.paxName}>{passenger.name}</Text>
                  <Text style={styles.paxSub}>{passenger.code} • Traveler {index + 1}</Text>
                </View>
              </View>

              <Text style={styles.paxTotalText}>
                ₹{totalPassengerCost.toLocaleString('en-IN')}
              </Text>
            </View>

            {/* Seat Line Item */}
            <View style={styles.lineItemRow}>
              <View style={styles.lineItemLeft}>
                <Armchair size={15} color="#475569" style={styles.lineIcon} />
                <View>
                  <Text style={styles.lineTitle}>
                    {seat ? `Seat ${seat.id}` : 'No Seat Assigned'}
                  </Text>
                  <Text style={styles.lineSubtitle}>{seatCategoryLabel}</Text>
                </View>
              </View>
              <Text style={styles.linePrice}>
                {seatPrice === 0 ? '₹0' : `₹${seatPrice}`}
              </Text>
            </View>

            {/* Meal Line Item */}
            <View style={[styles.lineItemRow, styles.lineItemBorder]}>
              <View style={styles.lineItemLeft}>
                <Utensils size={15} color="#475569" style={styles.lineIcon} />
                <View>
                  <Text style={styles.lineTitle}>{meal.name}</Text>
                  <Text style={styles.lineSubtitle}>{meal.dietaryTag || 'Dining'}</Text>
                </View>
              </View>
              <Text style={styles.linePrice}>
                {mealPrice === 0 ? '₹0' : `₹${mealPrice}`}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Pricing Summary Calculation Card */}
      <View style={styles.priceCard}>
        <View style={styles.priceCardHeader}>
          <Receipt size={17} color="#0F172A" />
          <Text style={styles.priceCardTitle}>CHARGES SUMMARY</Text>
        </View>

        <View style={styles.chargeRow}>
          <Text style={styles.chargeLabel}>
            Total Seat Selection Charges ({passengerCount} pax)
          </Text>
          <Text style={styles.chargeValue}>
            ₹{totalSeatCharges.toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={styles.chargeRow}>
          <Text style={styles.chargeLabel}>
            Total In-flight Meal Charges ({passengerCount} meals)
          </Text>
          <Text style={styles.chargeValue}>
            ₹{totalMealCharges.toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={styles.chargeDivider} />

        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total Amount Due</Text>
            <Text style={styles.totalTaxNotice}>Inclusive of all airline fees & taxes</Text>
          </View>
          <Text style={styles.totalValue}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Confirmation Action Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleFinishBooking}
        activeOpacity={0.85}
      >
        <ShieldCheck size={18} color="#FFFFFF" style={styles.confirmIcon} />
        <Text style={styles.confirmButtonText}>Confirm & Complete Booking</Text>
      </TouchableOpacity>

      {/* Confirmation Success Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconCircle}>
              <CheckCircle size={38} color="#059669" />
            </View>

            <Text style={styles.modalTitle}>Seat Selection Confirmed</Text>
            <Text style={styles.modalBookingRef}>
              Booking Reference: EA-784291
            </Text>

            <View style={styles.modalSummaryBox}>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Flight</Text>
                <Text style={styles.modalSummaryVal}>DEL → BOM (EA 204)</Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Passengers</Text>
                <Text style={styles.modalSummaryVal}>{passengerCount} Travelers</Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Layout</Text>
                <Text style={styles.modalSummaryVal}>{layoutTitle}</Text>
              </View>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Total Paid</Text>
                <Text style={styles.modalSummaryValHighlight}>
                  ₹{totalAmount.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <Text style={styles.modalNote}>
              Mock confirmation created for this frontend technical assessment. No live payment was charged.
            </Text>

            <TouchableOpacity
              style={styles.modalDoneButton}
              onPress={handleResetAll}
              activeOpacity={0.85}
            >
              <RotateCcw size={16} color="#FFFFFF" style={styles.resetIcon} />
              <Text style={styles.modalDoneButtonText}>Start New Booking</Text>
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
    paddingBottom: 32,
  },
  flightSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  airlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
    marginBottom: 12,
  },
  airlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 6,
  },
  flightCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeRight: {
    alignItems: 'flex-end',
  },
  cityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  routeArrowBox: {
    alignItems: 'center',
  },
  durationBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  layoutNoticeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  layoutNoticeLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  layoutNoticeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  modifyLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  passengerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 10,
  },
  paxTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  paxName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  paxSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  paxTotalText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  lineItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  lineItemBorder: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 8,
  },
  lineItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineIcon: {
    marginRight: 8,
  },
  lineTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  lineSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 1,
  },
  linePrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  priceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  priceCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  chargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chargeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  chargeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  chargeDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalTaxNotice: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  confirmIcon: {
    marginRight: 8,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
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
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalBookingRef: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 4,
    marginBottom: 16,
  },
  modalSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    width: '100%',
    marginBottom: 14,
  },
  modalSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  modalSummaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  modalSummaryVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalSummaryValHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalNote: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 18,
  },
  modalDoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
  },
  resetIcon: {
    marginRight: 6,
  },
  modalDoneButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

