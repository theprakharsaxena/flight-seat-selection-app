import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ArrowUp, DoorOpen } from 'lucide-react-native';
import { CabinLayoutType, Passenger, SeatDefinition, SeatStatus } from '../types';
import {
  LAYOUT_3_2_CONFIG,
  LAYOUT_2_3_2_CONFIG,
  SEATS_BY_LAYOUT,
} from '../data/seatData';
import { SeatItem } from './SeatItem';

interface SeatMapProps {
  layout: CabinLayoutType;
  activePassenger: Passenger;
  seatAssignments: Record<string, string>; // passengerId -> seatId in active layout
  validPassengers: Passenger[];
  onSelectSeat: (seatId: string) => void;
  getPassengerForSeat: (seatId: string) => Passenger | null;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  layout,
  activePassenger,
  seatAssignments,
  validPassengers,
  onSelectSeat,
  getPassengerForSeat,
}) => {
  const is3_2 = layout === '3-2';
  const config = is3_2 ? LAYOUT_3_2_CONFIG : LAYOUT_2_3_2_CONFIG;
  const seats = SEATS_BY_LAYOUT[layout];

  // Group seats by row
  const rowMap = React.useMemo(() => {
    const map = new Map<number, Map<string, SeatDefinition>>();
    seats.forEach((seat) => {
      if (!map.has(seat.row)) {
        map.set(seat.row, new Map<string, SeatDefinition>());
      }
      map.get(seat.row)!.set(seat.col, seat);
    });
    return map;
  }, [seats]);

  const getSeatStatus = (seat: SeatDefinition): SeatStatus => {
    if (seat.isOccupied) return 'occupied';

    const currentSeatOfActive = seatAssignments[activePassenger.id];
    if (currentSeatOfActive === seat.id) return 'selected_active';

    const assignedPax = getPassengerForSeat(seat.id);
    if (assignedPax && assignedPax.id !== activePassenger.id) {
      return 'assigned_other';
    }

    if (seat.price === 0) return 'free';
    return 'available';
  };

  const renderAisleRowIndicator = (rowNum: number) => {
    return (
      <View style={styles.aisleIndicator}>
        <Text style={styles.rowNumberText}>{rowNum}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      {/* Aircraft Nose & Cockpit Indicator */}
      <View style={styles.cockpitCone}>
        <View style={styles.coneGraphic} />
        <View style={styles.frontBadge}>
          <ArrowUp size={13} color="#475569" strokeWidth={2.5} />
          <Text style={styles.frontText}>FRONT OF AIRCRAFT</Text>
        </View>
      </View>

      {/* Column Letters Header */}
      <View style={styles.columnHeaderRow}>
        {is3_2 ? (
          <>
            <View style={styles.columnGroupLeft}>
              {LAYOUT_3_2_CONFIG.leftGroup.map((col) => (
                <View key={col} style={styles.colHeaderBox}>
                  <Text style={styles.colHeaderText}>{col}</Text>
                </View>
              ))}
            </View>

            <View style={styles.aisleHeaderBox}>
              <Text style={styles.aisleHeaderText}>Aisle</Text>
            </View>

            <View style={styles.columnGroupRight}>
              {LAYOUT_3_2_CONFIG.rightGroup.map((col) => (
                <View key={col} style={styles.colHeaderBox}>
                  <Text style={styles.colHeaderText}>{col}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.columnGroupLeft}>
              {LAYOUT_2_3_2_CONFIG.leftGroup.map((col) => (
                <View key={col} style={styles.colHeaderBoxCompact}>
                  <Text style={styles.colHeaderText}>{col}</Text>
                </View>
              ))}
            </View>

            <View style={styles.aisleHeaderBoxCompact}>
              <Text style={styles.aisleHeaderText}>Aisle</Text>
            </View>

            <View style={styles.columnGroupMiddle}>
              {LAYOUT_2_3_2_CONFIG.middleGroup.map((col) => (
                <View key={col} style={styles.colHeaderBoxCompact}>
                  <Text style={styles.colHeaderText}>{col}</Text>
                </View>
              ))}
            </View>

            <View style={styles.aisleHeaderBoxCompact}>
              <Text style={styles.aisleHeaderText}>Aisle</Text>
            </View>

            <View style={styles.columnGroupRight}>
              {LAYOUT_2_3_2_CONFIG.rightGroup.map((col) => (
                <View key={col} style={styles.colHeaderBoxCompact}>
                  <Text style={styles.colHeaderText}>{col}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      {/* Fuselage Cabin Rows */}
      <View style={styles.cabinFuselage}>
        {Array.from({ length: config.totalRows }, (_, i) => i + 1).map((rowNum) => {
          const rowSeats = rowMap.get(rowNum);
          if (!rowSeats) return null;

          const isExitRow = config.exitRows.includes(rowNum);
          const isOverWing = config.wingRows.includes(rowNum);

          return (
            <React.Fragment key={rowNum}>
              {/* Emergency Exit Row Notice */}
              {isExitRow && (
                <View style={styles.exitRowBanner}>
                  <DoorOpen size={13} color="#B45309" />
                  <Text style={styles.exitRowBannerText}>
                    EMERGENCY EXIT ROW • EXTRA LEGROOM
                  </Text>
                  <DoorOpen size={13} color="#B45309" />
                </View>
              )}

              <View style={[styles.rowContainer, isExitRow && styles.rowContainerExit]}>
                {/* Wing marker indicator on outer sides */}
                {isOverWing && <View style={styles.wingLeft} />}

                {is3_2 ? (
                  /* 3 - 2 Row Structure */
                  <View style={styles.seatRow}>
                    {/* Left: A, B, C */}
                    <View style={styles.cluster}>
                      {LAYOUT_3_2_CONFIG.leftGroup.map((col) => {
                        const seat = rowSeats.get(col);
                        if (!seat) return null;
                        const status = getSeatStatus(seat);
                        const assignedPax = getPassengerForSeat(seat.id);

                        return (
                          <SeatItem
                            key={seat.id}
                            seat={seat}
                            status={status}
                            assignedPassenger={assignedPax}
                            activePassenger={activePassenger}
                            onSelect={onSelectSeat}
                            compact={false}
                          />
                        );
                      })}
                    </View>

                    {/* Single Central Aisle */}
                    {renderAisleRowIndicator(rowNum)}

                    {/* Right: D, E */}
                    <View style={styles.cluster}>
                      {LAYOUT_3_2_CONFIG.rightGroup.map((col) => {
                        const seat = rowSeats.get(col);
                        if (!seat) return null;
                        const status = getSeatStatus(seat);
                        const assignedPax = getPassengerForSeat(seat.id);

                        return (
                          <SeatItem
                            key={seat.id}
                            seat={seat}
                            status={status}
                            assignedPassenger={assignedPax}
                            activePassenger={activePassenger}
                            onSelect={onSelectSeat}
                            compact={false}
                          />
                        );
                      })}
                    </View>
                  </View>
                ) : (
                  /* 2 - 3 - 2 Row Structure */
                  <View style={styles.seatRow}>
                    {/* Left: A, B */}
                    <View style={styles.cluster}>
                      {LAYOUT_2_3_2_CONFIG.leftGroup.map((col) => {
                        const seat = rowSeats.get(col);
                        if (!seat) return null;
                        const status = getSeatStatus(seat);
                        const assignedPax = getPassengerForSeat(seat.id);

                        return (
                          <SeatItem
                            key={seat.id}
                            seat={seat}
                            status={status}
                            assignedPassenger={assignedPax}
                            activePassenger={activePassenger}
                            onSelect={onSelectSeat}
                            compact={true}
                          />
                        );
                      })}
                    </View>

                    {/* Aisle 1 */}
                    {renderAisleRowIndicator(rowNum)}

                    {/* Middle: C, D, E */}
                    <View style={styles.cluster}>
                      {LAYOUT_2_3_2_CONFIG.middleGroup.map((col) => {
                        const seat = rowSeats.get(col);
                        if (!seat) return null;
                        const status = getSeatStatus(seat);
                        const assignedPax = getPassengerForSeat(seat.id);

                        return (
                          <SeatItem
                            key={seat.id}
                            seat={seat}
                            status={status}
                            assignedPassenger={assignedPax}
                            activePassenger={activePassenger}
                            onSelect={onSelectSeat}
                            compact={true}
                          />
                        );
                      })}
                    </View>

                    {/* Aisle 2 */}
                    {renderAisleRowIndicator(rowNum)}

                    {/* Right: F, G */}
                    <View style={styles.cluster}>
                      {LAYOUT_2_3_2_CONFIG.rightGroup.map((col) => {
                        const seat = rowSeats.get(col);
                        if (!seat) return null;
                        const status = getSeatStatus(seat);
                        const assignedPax = getPassengerForSeat(seat.id);

                        return (
                          <SeatItem
                            key={seat.id}
                            seat={seat}
                            status={status}
                            assignedPassenger={assignedPax}
                            activePassenger={activePassenger}
                            onSelect={onSelectSeat}
                            compact={true}
                          />
                        );
                      })}
                    </View>
                  </View>
                )}

                {isOverWing && <View style={styles.wingRight} />}
              </View>
            </React.Fragment>
          );
        })}
      </View>

      {/* Rear Cabin Galley & Exit */}
      <View style={styles.rearGalley}>
        <View style={styles.rearDivider} />
        <Text style={styles.rearText}>REAR GALLEY & RESTROOMS</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 32,
    alignItems: 'center',
  },
  cockpitCone: {
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  coneGraphic: {
    width: 90,
    height: 18,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  frontBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  frontText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.6,
    marginLeft: 4,
  },
  columnHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    paddingHorizontal: 10,
    width: '100%',
  },
  columnGroupLeft: {
    flexDirection: 'row',
  },
  columnGroupMiddle: {
    flexDirection: 'row',
  },
  columnGroupRight: {
    flexDirection: 'row',
  },
  colHeaderBox: {
    width: 38,
    marginHorizontal: 2.5,
    alignItems: 'center',
  },
  colHeaderBoxCompact: {
    width: 33,
    marginHorizontal: 1.5,
    alignItems: 'center',
  },
  colHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  aisleHeaderBox: {
    width: 28,
    alignItems: 'center',
  },
  aisleHeaderBoxCompact: {
    width: 22,
    alignItems: 'center',
  },
  aisleHeaderText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  cabinFuselage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 1,
  },
  rowContainerExit: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    paddingVertical: 2,
    marginVertical: 4,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aisleIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  rowNumberText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  exitRowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  exitRowBannerText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B45309',
    marginHorizontal: 6,
    letterSpacing: 0.4,
  },
  wingLeft: {
    position: 'absolute',
    left: -12,
    width: 8,
    height: 38,
    backgroundColor: '#CBD5E1',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  wingRight: {
    position: 'absolute',
    right: -12,
    width: 8,
    height: 38,
    backgroundColor: '#CBD5E1',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  rearGalley: {
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  rearDivider: {
    width: 140,
    height: 3,
    backgroundColor: '#E2E8F0',
    borderRadius: 1.5,
    marginBottom: 6,
  },
  rearText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
});

