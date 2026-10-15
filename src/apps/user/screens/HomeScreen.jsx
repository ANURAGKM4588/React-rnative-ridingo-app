import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';
import { colors, layout } from '../../../theme';

const RIDE_OPTIONS = [
  { id: 'prime_sedan', name: 'Prime Sedan', eta: '3 min', price: 290, icon: 'car-side', desc: 'Spacious AC sedan, top drivers' },
  { id: 'comfort_auto', name: 'Smart Auto', eta: '2 min', price: 145, icon: 'rickshaw', desc: 'Fast, door-step metered auto' },
  { id: 'bike_express', name: 'Bike Taxi', eta: '1 min', price: 75, icon: 'motorbike', desc: 'Beat the traffic in minutes' },
  { id: 'driver_hourly', name: 'Hire Driver', eta: 'Scheduled', price: 450, icon: 'account-tie', desc: 'Driver for your personal car' },
];

export default function HomeScreen({ navigation }) {
  const {
    user,
    pickupLocation,
    setPickupLocation,
    dropLocation,
    setDropLocation,
    selectedRideType,
    setSelectedRideType,
    activeRide,
    setIsBookingOpen,
    setIsLiveTrackingOpen,
  } = useUser();

  const selectedOption = RIDE_OPTIONS.find(o => o.id === selectedRideType) || RIDE_OPTIONS[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeSubtitle}>Good afternoon,</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBadge}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={38} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Active Ride Banner if ride is ongoing */}
        {activeRide && (
          <TouchableOpacity
            style={styles.activeRideBanner}
            activeOpacity={0.9}
            onPress={() => setIsLiveTrackingOpen(true)}
          >
            <View style={styles.activeRidePulse} />
            <View style={{ flex: 1 }}>
              <Text style={styles.activeRideTitle}>Trip in progress • {activeRide.driver?.name}</Text>
              <Text style={styles.activeRideSubtitle}>ETA: {activeRide.driver?.etaMinutes} mins • OTP: {activeRide.otp}</Text>
            </View>
            <View style={styles.activeRideBtn}>
              <Text style={styles.activeRideBtnText}>Track</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Location Destination Search Card */}
        <View style={styles.searchCard}>
          <View style={styles.locationInputRow}>
            <View style={styles.locationDotGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>PICKUP</Text>
              <TextInput
                style={styles.textInput}
                value={pickupLocation}
                onChangeText={setPickupLocation}
                placeholder="Enter pickup address"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.locationInputRow}>
            <View style={styles.locationDotRed} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>WHERE TO?</Text>
              <TextInput
                style={styles.textInput}
                value={dropLocation}
                onChangeText={setDropLocation}
                placeholder="Enter destination"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            {dropLocation.length > 0 && (
              <TouchableOpacity onPress={() => setDropLocation('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Ride Category Selector */}
        <Text style={styles.sectionTitle}>Select Your Ride</Text>
        <View style={styles.rideOptionsList}>
          {RIDE_OPTIONS.map((opt) => {
            const isSelected = selectedRideType === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.rideCard, isSelected && styles.rideCardSelected]}
                onPress={() => setSelectedRideType(opt.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.rideIconWrapper, isSelected && styles.rideIconWrapperSelected]}>
                  <MaterialCommunityIcons
                    name={opt.icon}
                    size={28}
                    color={isSelected ? '#FFFFFF' : colors.primaryDark}
                  />
                </View>

                <View style={styles.rideDetails}>
                  <View style={styles.rideTitleRow}>
                    <Text style={styles.rideName}>{opt.name}</Text>
                    <Text style={styles.ridePrice}>₹{opt.price}</Text>
                  </View>
                  <Text style={styles.rideDesc}>{opt.desc}</Text>
                  <View style={styles.etaBadge}>
                    <Feather name="clock" size={11} color={colors.primaryDark} />
                    <Text style={styles.etaText}>{opt.eta}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Safety & SOS Quick Action */}
        <View style={styles.safetyCard}>
          <View style={styles.safetyIconContainer}>
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.safetyTitle}>Ridingo Verified Safety</Text>
            <Text style={styles.safetySubtitle}>Driver background checked • 24x7 Live SOS support</Text>
          </View>
        </View>

        {/* Bottom Booking Button */}
        <TouchableOpacity
          style={styles.bookButton}
          activeOpacity={0.85}
          onPress={() => setIsBookingOpen(true)}
        >
          <Text style={styles.bookButtonText}>Book {selectedOption.name} • ₹{selectedOption.price}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    padding: layout.paddingHorizontal,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileBadge: {
    padding: 2,
  },
  activeRideBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: layout.radiusMd,
    padding: 14,
    marginBottom: 16,
  },
  activeRidePulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    marginRight: 10,
  },
  activeRideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  activeRideSubtitle: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  activeRideBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: layout.radiusFull,
  },
  activeRideBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  searchCard: {
    backgroundColor: colors.card,
    borderRadius: layout.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  locationDotRed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
    marginRight: 12,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  textInput: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingVertical: 4,
  },
  dividerLine: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
    marginLeft: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  rideOptionsList: {
    gap: 12,
    marginBottom: 20,
  },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: layout.radiusMd,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  rideCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  rideIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rideIconWrapperSelected: {
    backgroundColor: colors.primary,
  },
  rideDetails: {
    flex: 1,
  },
  rideTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ridePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rideDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: layout.radiusMd,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    gap: 12,
  },
  safetyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  safetySubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: layout.radiusLg,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
