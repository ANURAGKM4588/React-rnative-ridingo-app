import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';
import { colors, layout } from '../../../theme';

export default function LiveTrackingModal() {
  const {
    activeRide,
    isLiveTrackingOpen,
    setIsLiveTrackingOpen,
    cancelActiveRide,
  } = useUser();

  if (!isLiveTrackingOpen || !activeRide) return null;

  const handleCallDriver = () => {
    if (activeRide.driver?.phone) {
      Linking.openURL(`tel:${activeRide.driver.phone}`).catch(() => {
        Alert.alert('Phone Call', `Driver Phone: ${activeRide.driver.phone}`);
      });
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Ride?',
      'Are you sure you want to cancel this booking? Cancellation within 5 mins is free.',
      [
        { text: 'Keep Ride', style: 'cancel' },
        { text: 'Cancel Ride', style: 'destructive', onPress: cancelActiveRide },
      ]
    );
  };

  return (
    <Modal visible={isLiveTrackingOpen} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsLiveTrackingOpen(false)} style={styles.closeBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Trip Status</Text>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelTopBtn}>
            <Text style={styles.cancelTopText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Live Simulation Map Graphics Card */}
        <View style={styles.mapGraphicCard}>
          <View style={styles.pulseRadar} />
          <Ionicons name="car" size={48} color={colors.primary} />
          <Text style={styles.mapGraphicStatus}>Driver is en-route to your pickup</Text>
          <Text style={styles.etaHighlight}>Arriving in {activeRide.driver?.etaMinutes || 4} mins</Text>
        </View>

        {/* OTP PIN Verification Card */}
        <View style={styles.otpCard}>
          <View>
            <Text style={styles.otpLabel}>START OTP PIN</Text>
            <Text style={styles.otpSub}>Share with driver before starting trip</Text>
          </View>
          <View style={styles.otpBadge}>
            <Text style={styles.otpDigits}>{activeRide.otp || '4821'}</Text>
          </View>
        </View>

        {/* Driver & Car Details Card */}
        <View style={styles.driverCard}>
          <View style={styles.driverInfoRow}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.driverName}>{activeRide.driver?.name}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>{activeRide.driver?.rating}</Text>
                </View>
              </View>
              <Text style={styles.carDetails}>{activeRide.driver?.vehicle}</Text>
            </View>
          </View>

          {/* Quick Contact Buttons */}
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn} onPress={handleCallDriver} activeOpacity={0.8}>
              <Ionicons name="call" size={18} color="#FFFFFF" />
              <Text style={styles.contactBtnText}>Call Driver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactBtn, styles.msgBtn]}
              onPress={() => Alert.alert('Chat', 'Driver is driving and will receive audio message')}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-ellipses" size={18} color={colors.primaryDark} />
              <Text style={styles.msgBtnText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety & SOS Strip */}
        <View style={styles.sosCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="shield-checkmark" size={22} color="#10B981" />
            <View>
              <Text style={styles.sosTitle}>Ride Protected by Ridingo 24/7</Text>
              <Text style={styles.sosSub}>Emergency SOS & live location sharing enabled</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cancelTopBtn: {
    padding: 6,
  },
  cancelTopText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 14,
  },
  mapGraphicCard: {
    height: 220,
    backgroundColor: '#E0F2FE',
    margin: 16,
    borderRadius: layout.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  pulseRadar: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
  },
  mapGraphicStatus: {
    fontSize: 13,
    color: '#0369A1',
    fontWeight: '600',
    marginTop: 8,
  },
  etaHighlight: {
    fontSize: 22,
    fontWeight: '800',
    color: '#075985',
    marginTop: 4,
  },
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: layout.radiusMd,
    borderWidth: 1.5,
    borderColor: '#10B981',
    marginBottom: 16,
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
  },
  otpSub: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  otpBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: layout.radiusSm,
  },
  otpDigits: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  driverCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: layout.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  carDetails: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: layout.radiusMd,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  msgBtn: {
    backgroundColor: '#F1F5F9',
  },
  msgBtnText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  sosCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: layout.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sosTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sosSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
