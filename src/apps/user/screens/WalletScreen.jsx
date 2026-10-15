import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';
import { colors, layout } from '../../../theme';

const RECHARGE_AMOUNTS = [100, 250, 500, 1000];

export default function WalletScreen() {
  const { user, topupWallet } = useUser();
  const [selectedAmt, setSelectedAmt] = useState(500);

  const handleTopup = (amt) => {
    topupWallet(amt);
    Alert.alert('Wallet Recharged', `₹${amt} successfully credited to your Ridingo Wallet via UPI.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ridingo Wallet & Payments</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Gradient Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
            <MaterialCommunityIcons name="wallet" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.balanceValue}>₹{user.walletBalance}</Text>
          <Text style={styles.balanceSub}>Zero extra fees • Instant ride auto-deduct</Text>
        </View>

        {/* Quick Topup Options */}
        <Text style={styles.sectionTitle}>Add Money to Wallet</Text>
        <View style={styles.amtRow}>
          {RECHARGE_AMOUNTS.map((amt) => {
            const isSelected = selectedAmt === amt;
            return (
              <TouchableOpacity
                key={amt}
                style={[styles.amtBtn, isSelected && styles.amtBtnActive]}
                onPress={() => setSelectedAmt(amt)}
                activeOpacity={0.8}
              >
                <Text style={[styles.amtText, isSelected && styles.amtTextActive]}>₹{amt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.addMoneyBtn}
          onPress={() => handleTopup(selectedAmt)}
          activeOpacity={0.85}
        >
          <Ionicons name="flash" size={18} color="#FFFFFF" />
          <Text style={styles.addMoneyBtnText}>Add ₹{selectedAmt} via UPI / Netbanking</Text>
        </TouchableOpacity>

        {/* Offers & Cashback */}
        <View style={styles.offerCard}>
          <View style={styles.offerIcon}>
            <Ionicons name="gift" size={24} color="#7C3AED" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.offerTitle}>Flat 20% Cashback on First 3 Rides</Text>
            <Text style={styles.offerSub}>Automatically credited to wallet on completed trips</Text>
          </View>
        </View>

        {/* Saved Payment Methods */}
        <Text style={styles.sectionTitle}>Linked Payment Accounts</Text>
        <View style={styles.paymentMethodsList}>
          <View style={styles.payMethodItem}>
            <MaterialCommunityIcons name="google" size={22} color="#EA4335" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.methodName}>Google Pay UPI</Text>
              <Text style={styles.methodSub}>Default UPI App</Text>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>Linked</Text>
            </View>
          </View>

          <View style={styles.payMethodItem}>
            <MaterialCommunityIcons name="cellphone" size={22} color="#5F259F" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.methodName}>PhonePe UPI</Text>
              <Text style={styles.methodSub}>arjun.menon@ybl</Text>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>Linked</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  content: {
    padding: layout.paddingHorizontal,
    paddingTop: 16,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: '#065F46',
    borderRadius: layout.radiusLg,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginVertical: 10,
  },
  balanceSub: {
    color: '#D1FAE5',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  amtRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  amtBtn: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: layout.radiusMd,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  amtBtnActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  amtText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  amtTextActive: {
    color: colors.primaryDark,
  },
  addMoneyBtn: {
    backgroundColor: colors.primary,
    borderRadius: layout.radiusLg,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  addMoneyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: layout.radiusMd,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: 24,
    gap: 12,
  },
  offerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B21B6',
  },
  offerSub: {
    fontSize: 11,
    color: '#6D28D9',
    marginTop: 2,
  },
  paymentMethodsList: {
    gap: 10,
  },
  payMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: layout.radiusMd,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  methodSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  activeTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  activeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
});
