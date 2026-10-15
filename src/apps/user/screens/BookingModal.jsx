import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';
import { colors, layout } from '../../../theme';

export default function BookingModal() {
  const {
    isBookingOpen,
    setIsBookingOpen,
    selectedRideType,
    pickupLocation,
    dropLocation,
    bookRide,
    user,
  } = useUser();

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'wallet' | 'cash'

  if (!isBookingOpen) return null;

  const handleConfirm = () => {
    bookRide({
      name: selectedRideType === 'prime_sedan' ? 'Prime Sedan' : selectedRideType === 'comfort_auto' ? 'Smart Auto' : 'Bike Taxi',
      price: selectedRideType === 'prime_sedan' ? 290 : selectedRideType === 'comfort_auto' ? 145 : 75,
    });
  };

  const fareAmount = selectedRideType === 'prime_sedan' ? 290 : selectedRideType === 'comfort_auto' ? 145 : 75;

  return (
    <Modal visible={isBookingOpen} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsBookingOpen(false)} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ride Summary & Payment</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Pickup & Destination Summary */}
          <View style={styles.card}>
            <View style={styles.locationItem}>
              <View style={styles.dotGreen} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>PICKUP</Text>
                <Text style={styles.addressText}>{pickupLocation || 'Current Location'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.locationItem}>
              <View style={styles.dotRed} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>DROPOFF</Text>
                <Text style={styles.addressText}>{dropLocation || 'Selected Destination'}</Text>
              </View>
            </View>
          </View>

          {/* Pricing Breakdown */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fare Breakdown</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Fare</Text>
              <Text style={styles.priceVal}>₹{fareAmount - 40}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Ridingo Safety & Platform Fee</Text>
              <Text style={styles.priceVal}>₹25</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>GST & Govt Taxes</Text>
              <Text style={styles.priceVal}>₹15</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.priceRowTotal}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalVal}>₹{fareAmount}</Text>
            </View>
          </View>

          {/* Payment Method Selector */}
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>

          <TouchableOpacity
            style={[styles.paymentCard, paymentMethod === 'upi' && styles.paymentCardActive]}
            onPress={() => setPaymentMethod('upi')}
          >
            <MaterialCommunityIcons name="contactless-payment" size={26} color="#7C3AED" />
            <View style={{ flex: 1 }}>
              <Text style={styles.payName}>Instant UPI (PhonePe / GPay / Paytm)</Text>
              <Text style={styles.paySub}>Direct bank transfer, zero extra charge</Text>
            </View>
            {paymentMethod === 'upi' && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentCard, paymentMethod === 'wallet' && styles.paymentCardActive]}
            onPress={() => setPaymentMethod('wallet')}
          >
            <MaterialCommunityIcons name="wallet-outline" size={26} color="#059669" />
            <View style={{ flex: 1 }}>
              <Text style={styles.payName}>Ridingo Wallet (Balance: ₹{user.walletBalance})</Text>
              <Text style={styles.paySub}>Instant 1-click checkout</Text>
            </View>
            {paymentMethod === 'wallet' && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentCard, paymentMethod === 'cash' && styles.paymentCardActive]}
            onPress={() => setPaymentMethod('cash')}
          >
            <MaterialCommunityIcons name="cash" size={26} color="#D97706" />
            <View style={{ flex: 1 }}>
              <Text style={styles.payName}>Pay Cash directly to Driver</Text>
              <Text style={styles.paySub}>Pay upon trip completion</Text>
            </View>
            {paymentMethod === 'cash' && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
          </TouchableOpacity>
        </ScrollView>

        {/* Footer Confirm */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} onPress={handleConfirm}>
            <Text style={styles.confirmBtnText}>Confirm Booking • ₹{fareAmount}</Text>
          </TouchableOpacity>
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
  content: {
    padding: layout.paddingHorizontal,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: layout.radiusMd,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  dotRed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
    marginRight: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  priceLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  priceVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  priceRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: layout.radiusMd,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
    gap: 12,
  },
  paymentCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  payName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  paySub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: layout.radiusLg,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
