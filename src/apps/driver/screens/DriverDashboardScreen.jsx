import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDriver } from '../../../context/DriverContext';
import { colors, layout } from '../../../theme';

export default function DriverDashboardScreen() {
  const {
    driver,
    isOnline,
    toggleOnline,
    incomingRequest,
    acceptRequest,
    declineRequest,
    currentTrip,
    advanceTripStep,
  } = useDriver();

  const handleTripAction = () => {
    if (!currentTrip) return;
    if (currentTrip.status === 'arriving_at_pickup') {
      Alert.alert(
        'Verify Rider OTP',
        'Ask rider for their 4-digit start PIN. Rider OTP is 4821.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Start Ride', onPress: advanceTripStep },
        ]
      );
    } else if (currentTrip.status === 'in_progress') {
      Alert.alert(
        'Complete Trip & Collect Fare',
        `Collect ₹${currentTrip.fare} from rider via Cash or UPI QR.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Trip Completed', onPress: advanceTripStep },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Driver Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.driverGreeting}>Driver Partner Mode</Text>
            <Text style={styles.driverName}>{driver.name}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>{driver.rating}</Text>
          </View>
        </View>

        {/* Online / Offline Big Switcher Card */}
        <View style={[styles.statusCard, isOnline ? styles.statusCardOnline : styles.statusCardOffline]}>
          <View style={styles.statusInfoCol}>
            <View style={styles.statusIndicatorRow}>
              <View style={[styles.pulseDot, { backgroundColor: isOnline ? '#10B981' : '#94A3B8' }]} />
              <Text style={styles.statusLabel}>
                {isOnline ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}
              </Text>
            </View>
            <Text style={styles.statusSub}>
              {isOnline ? 'Searching nearby rider booking requests...' : 'Go online to start receiving ride requests'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.onlineToggleBtn, isOnline ? styles.btnGoOffline : styles.btnGoOnline]}
            onPress={toggleOnline}
            activeOpacity={0.85}
          >
            <Text style={styles.onlineToggleBtnText}>
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Incoming Ride Request Alert Modal/Card */}
        {incomingRequest && (
          <View style={styles.incomingReqCard}>
            <View style={styles.reqHeaderRow}>
              <View style={styles.pulseReqDot} />
              <Text style={styles.reqTitle}>NEW RIDE REQUEST</Text>
              <Text style={styles.reqFare}>₹{incomingRequest.fare}</Text>
            </View>

            <View style={styles.reqRiderRow}>
              <Ionicons name="person-circle" size={32} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.reqRiderName}>{incomingRequest.customerName}</Text>
                <Text style={styles.reqDist}>
                  {incomingRequest.distanceKm} km • {incomingRequest.estimatedMinutes} mins
                </Text>
              </View>
            </View>

            <View style={styles.reqLocationBox}>
              <Text style={styles.locLabel}>PICKUP</Text>
              <Text style={styles.locVal}>{incomingRequest.pickup}</Text>
              <View style={{ height: 6 }} />
              <Text style={styles.locLabel}>DROPOFF</Text>
              <Text style={styles.locVal}>{incomingRequest.dropoff}</Text>
            </View>

            <View style={styles.reqBtnRow}>
              <TouchableOpacity
                style={styles.declineBtn}
                onPress={declineRequest}
                activeOpacity={0.8}
              >
                <Text style={styles.declineBtnText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => acceptRequest(incomingRequest)}
                activeOpacity={0.85}
              >
                <Text style={styles.acceptBtnText}>Accept Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Active Trip Execution Card */}
        {currentTrip && (
          <View style={styles.activeTripCard}>
            <View style={styles.tripStatusTag}>
              <Text style={styles.tripStatusTagText}>
                {currentTrip.status === 'arriving_at_pickup' ? 'PICKUP EN ROUTE' : 'RIDE IN PROGRESS'}
              </Text>
            </View>

            <View style={styles.activeTripBody}>
              <Text style={styles.riderHeading}>{currentTrip.customerName}</Text>
              <Text style={styles.activeRouteText}>
                {currentTrip.status === 'arriving_at_pickup' ? currentTrip.pickup : currentTrip.dropoff}
              </Text>
              <Text style={styles.fareTag}>Fare: ₹{currentTrip.fare} • {currentTrip.paymentMode}</Text>
            </View>

            <TouchableOpacity
              style={styles.advanceTripBtn}
              onPress={handleTripAction}
              activeOpacity={0.85}
            >
              <Text style={styles.advanceTripBtnText}>
                {currentTrip.status === 'arriving_at_pickup' ? 'Verify OTP & Start Ride' : 'Complete Trip & Collect Fare'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's Metrics Grid */}
        <Text style={styles.sectionTitle}>Today's Performance</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>TODAY'S EARNINGS</Text>
            <Text style={styles.metricValue}>₹{driver.todayEarnings}</Text>
            <Text style={styles.metricSub}>+₹120 Tips</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>COMPLETED TRIPS</Text>
            <Text style={styles.metricValue}>{driver.totalTrips}</Text>
            <Text style={styles.metricSub}>98% Acceptance</Text>
          </View>
        </View>

        {/* Assigned Vehicle Specs */}
        <Text style={styles.sectionTitle}>Registered Vehicle</Text>
        <View style={styles.vehicleCard}>
          <MaterialCommunityIcons name="car-estate" size={36} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.vehicleModel}>{driver.vehicleModel}</Text>
            <Text style={styles.vehiclePlate}>{driver.vehicleNumber}</Text>
            <Text style={styles.vehicleClass}>{driver.vehicleType} • Verified</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.verifiedText}>Active</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    padding: layout.paddingHorizontal,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  driverGreeting: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  driverName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  statusCard: {
    borderRadius: layout.radiusLg,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
  },
  statusCardOnline: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  statusCardOffline: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.textPrimary,
  },
  statusSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  onlineToggleBtn: {
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: layout.radiusMd,
    alignItems: 'center',
  },
  btnGoOnline: {
    backgroundColor: '#10B981',
  },
  btnGoOffline: {
    backgroundColor: '#EF4444',
  },
  onlineToggleBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  incomingReqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: layout.radiusLg,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginBottom: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  reqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pulseReqDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  reqTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
    flex: 1,
    marginLeft: 8,
  },
  reqFare: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
  },
  reqRiderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  reqRiderName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reqDist: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reqLocationBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: layout.radiusSm,
    padding: 12,
    marginBottom: 14,
  },
  locLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
  },
  locVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reqBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  declineBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: layout.radiusMd,
    alignItems: 'center',
  },
  declineBtnText: {
    color: colors.danger,
    fontWeight: '700',
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: layout.radiusMd,
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activeTripCard: {
    backgroundColor: '#065F46',
    borderRadius: layout.radiusLg,
    padding: 18,
    marginBottom: 20,
  },
  tripStatusTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tripStatusTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  activeTripBody: {
    marginBottom: 14,
  },
  riderHeading: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  activeRouteText: {
    color: '#D1FAE5',
    fontSize: 13,
    marginTop: 4,
  },
  fareTag: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  advanceTripBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: layout.radiusMd,
    alignItems: 'center',
  },
  advanceTripBtnText: {
    color: '#065F46',
    fontWeight: '800',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: layout.radiusMd,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  metricSub: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: layout.radiusMd,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vehicleModel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  vehiclePlate: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  vehicleClass: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
});
