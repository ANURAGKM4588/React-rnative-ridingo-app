import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import NativeIcon from './NativeIcon';
import NativeLiveMap from './NativeLiveMap';
import { LightTheme, DarkTheme, Typography, Radii, Shadows } from '../../styles/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function NativeLiveTrackingSheet({
  visible = false,
  trip,
  onClose,
  onCancelTrip,
  isDark = false,
}) {
  const theme = isDark ? DarkTheme : LightTheme;

  if (!trip) return null;

  const driverName = trip?.driver?.name || trip?.driver_name || 'Vikram Singh';
  const driverPhone = trip?.driver?.phone || trip?.driver_phone || '+919876543210';
  const driverRating = trip?.driver?.rating || '4.92';
  const driverTrips = trip?.driver?.tripsCount || '1,420';
  const startOtp = trip?.start_otp || trip?.otp || '4821';
  const etaMinutes = trip?.eta_minutes || 8;

  const handleCall = () => {
    Linking.openURL(`tel:${driverPhone}`).catch(() => {});
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi ${driverName}, I am your Ridingo passenger for trip #${trip.id || ''}.`);
    Linking.openURL(`https://wa.me/${driverPhone.replace('+', '')}?text=${text}`).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdropTouch} activeOpacity={1} onPress={onClose} />

        <View style={[styles.sheetContent, { backgroundColor: theme.card }]}>
          <View style={styles.handleBar} />

          {/* Top Bar with Status and Close */}
          <View style={styles.headerRow}>
            <View>
              <View style={styles.liveBadgeRow}>
                <View style={[styles.liveDot, { backgroundColor: theme.accentGreen }]} />
                <Text style={[styles.liveStatusTitle, { color: theme.ink }]}>
                  {trip.status === 'inprogress' ? 'Trip In Progress' : 'Driver Arriving'}
                </Text>
              </View>
              <Text style={[styles.etaText, { color: theme.muted }]}>
                {trip.status === 'inprogress' ? 'En route to destination' : `Arriving in ~${etaMinutes} mins`}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: theme.surface }]}
              onPress={onClose}
            >
              <NativeIcon name="x" size={16} color={theme.ink} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
            {/* 1. Live Interactive Native Map */}
            <View style={styles.mapContainer}>
              <NativeLiveMap
                trip={trip}
                height={210}
                isDark={isDark}
                showControls={false}
              />
            </View>

            {/* 2. OTP Security Card */}
            <View style={[styles.otpCard, { backgroundColor: theme.surface }]}>
              <View>
                <Text style={[styles.otpLabel, { color: theme.muted }]}>START TRIP OTP</Text>
                <Text style={[styles.otpHint, { color: theme.muted }]}>Share with driver to start ride</Text>
              </View>
              <View style={[styles.otpBadge, { backgroundColor: theme.yellow }]}>
                <Text style={styles.otpValue}>{startOtp}</Text>
              </View>
            </View>

            {/* 3. Driver Profile & Verified Badges */}
            <View style={[styles.driverCard, { backgroundColor: theme.surface, borderColor: theme.line }]}>
              <View style={styles.driverInfoRow}>
                <View style={[styles.avatarCircle, { backgroundColor: theme.solid }]}>
                  <Text style={[styles.avatarInitials, { color: theme.onSolid }]}>
                    {driverName.charAt(0)}
                  </Text>
                </View>

                <View style={styles.driverMeta}>
                  <Text style={[styles.driverNameText, { color: theme.ink }]}>{driverName}</Text>
                  <View style={styles.ratingRow}>
                    <NativeIcon name="star" size={12} color={theme.yellow} />
                    <Text style={[styles.driverStatsText, { color: theme.muted }]}>
                      {driverRating} ({driverTrips} trips) · Verified Pro
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons: Call & WhatsApp */}
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={[styles.driverActionBtn, { backgroundColor: theme.card, borderColor: theme.line }]}
                  onPress={handleCall}
                >
                  <NativeIcon name="phone" size={16} color={theme.ink} />
                  <Text style={[styles.actionBtnText, { color: theme.ink }]}>Call Driver</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.driverActionBtn, { backgroundColor: '#25D366' }]}
                  onPress={handleWhatsApp}
                >
                  <NativeIcon name="whatsapp" size={16} color="#FFFFFF" />
                  <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 4. Trip Route Summary */}
            <View style={[styles.routeBox, { backgroundColor: theme.surface }]}>
              <View style={styles.routeRow}>
                <View style={[styles.routeDot, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.routeText, { color: theme.ink }]} numberOfLines={1}>
                  {trip.pickup || 'Pickup location'}
                </Text>
              </View>
              <View style={[styles.routeLine, { backgroundColor: theme.line }]} />
              <View style={styles.routeRow}>
                <View style={[styles.routeDot, { backgroundColor: '#EF4444' }]} />
                <Text style={[styles.routeText, { color: theme.ink }]} numberOfLines={1}>
                  {trip.drop_loc || trip.destination || 'Destination'}
                </Text>
              </View>
            </View>

            {/* 5. Cancel Trip Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => onCancelTrip && onCancelTrip(trip)}
            >
              <Text style={styles.cancelButtonText}>Cancel Trip Request</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheetContent: {
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    maxHeight: SCREEN_HEIGHT * 0.9,
    paddingTop: 10,
    ...Shadows.floating,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCCCCC',
    alignSelf: 'center',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveStatusTitle: {
    ...Typography.title2,
  },
  etaText: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  mapContainer: {
    marginBottom: 14,
  },
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: Radii.md,
    marginBottom: 14,
  },
  otpLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  otpHint: {
    fontSize: 11,
    marginTop: 2,
  },
  otpBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radii.sm,
  },
  otpValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 2,
  },
  driverCard: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '700',
  },
  driverMeta: {
    flex: 1,
  },
  driverNameText: {
    fontSize: 15,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  driverStatsText: {
    fontSize: 11.5,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  driverActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: Radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  routeBox: {
    padding: 14,
    borderRadius: Radii.md,
    marginBottom: 20,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  routeLine: {
    width: 2,
    height: 12,
    marginLeft: 3,
    marginVertical: 4,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 24,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
});
