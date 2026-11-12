import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ArrowUp, ShieldAlert, DoorOpen } from 'lucide-react-native';
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
  seatAssignments: Record<string, string>;
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

  const renderAisleMarker = (rowNum: number) => {
    return (
      <View style={styles.aisleBadge}>
        <Text style={styles.aisleText}>{rowNum}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      {/* Aerodynamic Cockpit Nose */}
      <View style={styles.noseSection}>
        <View style={styles.noseCurve}>
          <View style={styles.cockpitGlassRow}>
            <View style={styles.cockpitWindow} />
            <View style={styles.cockpitWindowCenter} />
            <View style={styles.cockpitWindow} />
          </View>
        </View>
        <View style={styles.exitIndicatorFront}>
          <ArrowUp size={11} color="#64748B" strokeWidth={2.5} />
          <Text style={styles.exitIndicatorText}>FRONT • EXIT DOORS</Text>
        </View>
      </View>

      {/* Main Aircraft Fuselage Container */}
      <View style={styles.fuselageWrapper}>
        {/* Fuselage Left Wall with Windows */}
        <View style={styles.fuselageWallLeft}>
          {Array.from({ length: config.totalRows }, (_, i) => (
            <View key={i} style={styles.windowHole} />
          ))}
        </View>

        {/* Interior Cabin */}
        <View style={styles.cabinInterior}>
          {/* Column Header */}
          <View style={styles.columnHeaderRow}>
            {is3_2 ? (
              <>
                <View style={styles.colGroup}>
                  {LAYOUT_3_2_CONFIG.leftGroup.map((col) => (
                    <View key={col} style={styles.colBoxStandard}>
                      <Text style={styles.colHeaderText}>{col}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.aisleHeaderSpacer}>
                  <Text style={styles.aisleHeaderLabel}>Aisle</Text>
                </View>

                <View style={styles.colGroup}>
                  {LAYOUT_3_2_CONFIG.rightGroup.map((col) => (
                    <View key={col} style={styles.colBoxStandard}>
                      <Text style={styles.colHeaderText}>{col}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <>
                <View style={styles.colGroup}>
                  {LAYOUT_2_3_2_CONFIG.leftGroup.map((col) => (
                    <View key={col} style={styles.colBoxCompact}>
                      <Text style={styles.colHeaderText}>{col}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.aisleHeaderSpacerCompact}>
                  <Text style={styles.aisleHeaderLabel}>Aisle</Text>
                </View>

                <View style={styles.colGroup}>
                  {LAYOUT_2_3_2_CONFIG.middleGroup.map((col) => (
                    <View key={col} style={styles.colBoxCompact}>
                      <Text style={styles.colHeaderText}>{col}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.aisleHeaderSpacerCompact}>
                  <Text style={styles.aisleHeaderLabel}>Aisle</Text>
                </View>

                <View style={styles.colGroup}>
                  {LAYOUT_2_3_2_CONFIG.rightGroup.map((col) => (
                    <View key={col} style={styles.colBoxCompact}>
                      <Text style={styles.colHeaderText}>{col}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          {/* Seat Rows */}
          {Array.from({ length: config.totalRows }, (_, i) => i + 1).map((rowNum) => {
            const rowSeats = rowMap.get(rowNum);
            if (!rowSeats) return null;

            const isExitRow = config.exitRows.includes(rowNum);
            const isOverWing = config.wingRows.includes(rowNum);

            return (
              <React.Fragment key={rowNum}>
                {isExitRow && (
                  <View style={styles.exitRowDivider}>
                    <DoorOpen size={11} color="#B45309" />
                    <Text style={styles.exitRowLabel}>
                      EXIT ROW • EXTRA LEGROOM
                    </Text>
                    <DoorOpen size={11} color="#B45309" />
                  </View>
                )}

                <View
                  style={[
                    styles.rowContainer,
                    isExitRow && styles.rowExitHighlight,
                  ]}
                >
                  {is3_2 ? (
                    /* 3–2 Layout */
                    <View style={styles.seatsRow}>
                      <View style={styles.cluster}>
                        {LAYOUT_3_2_CONFIG.leftGroup.map((col) => {
                          const seat = rowSeats.get(col);
                          if (!seat) return null;
                          return (
                            <SeatItem
                              key={seat.id}
                              seat={seat}
                              status={getSeatStatus(seat)}
                              assignedPassenger={getPassengerForSeat(seat.id)}
                              activePassenger={activePassenger}
                              onSelect={onSelectSeat}
                              compact={false}
                            />
                          );
                        })}
                      </View>

                      {renderAisleMarker(rowNum)}

                      <View style={styles.cluster}>
                        {LAYOUT_3_2_CONFIG.rightGroup.map((col) => {
                          const seat = rowSeats.get(col);
                          if (!seat) return null;
                          return (
                            <SeatItem
                              key={seat.id}
                              seat={seat}
                              status={getSeatStatus(seat)}
                              assignedPassenger={getPassengerForSeat(seat.id)}
                              activePassenger={activePassenger}
                              onSelect={onSelectSeat}
                              compact={false}
                            />
                          );
                        })}
                      </View>
                    </View>
                  ) : (
                    /* 2–3–2 Layout */
                    <View style={styles.seatsRow}>
                      <View style={styles.cluster}>
                        {LAYOUT_2_3_2_CONFIG.leftGroup.map((col) => {
                          const seat = rowSeats.get(col);
                          if (!seat) return null;
                          return (
                            <SeatItem
                              key={seat.id}
                              seat={seat}
                              status={getSeatStatus(seat)}
                              assignedPassenger={getPassengerForSeat(seat.id)}
                              activePassenger={activePassenger}
                              onSelect={onSelectSeat}
                              compact={true}
                            />
                          );
                        })}
                      </View>

                      {renderAisleMarker(rowNum)}

                      <View style={styles.cluster}>
                        {LAYOUT_2_3_2_CONFIG.middleGroup.map((col) => {
                          const seat = rowSeats.get(col);
                          if (!seat) return null;
                          return (
                            <SeatItem
                              key={seat.id}
                              seat={seat}
                              status={getSeatStatus(seat)}
                              assignedPassenger={getPassengerForSeat(seat.id)}
                              activePassenger={activePassenger}
                              onSelect={onSelectSeat}
                              compact={true}
                            />
                          );
                        })}
                      </View>

                      {renderAisleMarker(rowNum)}

                      <View style={styles.cluster}>
                        {LAYOUT_2_3_2_CONFIG.rightGroup.map((col) => {
                          const seat = rowSeats.get(col);
                          if (!seat) return null;
                          return (
                            <SeatItem
                              key={seat.id}
                              seat={seat}
                              status={getSeatStatus(seat)}
                              assignedPassenger={getPassengerForSeat(seat.id)}
                              activePassenger={activePassenger}
                              onSelect={onSelectSeat}
                              compact={true}
                            />
                          );
                        })}
                      </View>
                    </View>
                  )}
                </View>
              </React.Fragment>
            );
          })}
        </View>

        {/* Fuselage Right Wall with Windows */}
        <View style={styles.fuselageWallRight}>
          {Array.from({ length: config.totalRows }, (_, i) => (
            <View key={i} style={styles.windowHole} />
          ))}
        </View>
      </View>

      {/* Rear Galley */}
      <View style={styles.rearSection}>
        <View style={styles.rearBar} />
        <Text style={styles.rearText}>REAR GALLEY & LAVATORIES</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 36,
  },
  noseSection: {
    alignItems: 'center',
    marginBottom: 6,
  },
  noseCurve: {
    width: 130,
    height: 38,
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  cockpitGlassRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cockpitWindow: {
    width: 14,
    height: 9,
    borderRadius: 3,
    backgroundColor: '#0F172A',
    marginHorizontal: 3,
  },
  cockpitWindowCenter: {
    width: 20,
    height: 10,
    borderRadius: 3,
    backgroundColor: '#0F172A',
    marginHorizontal: 3,
  },
  exitIndicatorFront: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  exitIndicatorText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.8,
    marginLeft: 3,
  },
  fuselageWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#E2E8F0',
    borderRadius: 24,
    padding: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  fuselageWallLeft: {
    width: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  fuselageWallRight: {
    width: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  windowHole: {
    width: 6,
    height: 11,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
    marginVertical: 10,
  },
  cabinInterior: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  columnHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  colGroup: {
    flexDirection: 'row',
  },
  colBoxStandard: {
    width: 38,
    marginHorizontal: 2.5,
    alignItems: 'center',
  },
  colBoxCompact: {
    width: 32,
    marginHorizontal: 1.5,
    alignItems: 'center',
  },
  colHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  aisleHeaderSpacer: {
    width: 24,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  aisleHeaderSpacerCompact: {
    width: 20,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  aisleHeaderLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  rowContainer: {
    marginVertical: 1,
    borderRadius: 6,
  },
  rowExitHighlight: {
    backgroundColor: '#FFFBEB',
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aisleBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  aisleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  exitRowDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    borderRadius: 4,
    marginVertical: 3,
  },
  exitRowLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#B45309',
    marginHorizontal: 6,
    letterSpacing: 0.5,
  },
  rearSection: {
    alignItems: 'center',
    marginTop: 14,
  },
  rearBar: {
    width: 120,
    height: 3,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    marginBottom: 6,
  },
  rearText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
});
