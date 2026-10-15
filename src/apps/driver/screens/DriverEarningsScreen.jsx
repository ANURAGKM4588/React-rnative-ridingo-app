import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDriver } from '../../../context/DriverContext';
import { colors, layout } from '../../../theme';

export default function DriverEarningsScreen() {
  const { driver, earningsHistory } = useDriver();

  const handleInstantPayout = () => {
    Alert.alert(
      'Instant Payout Transfer',
      `₹${driver.walletBalance} will be transferred directly to your bank account: \nHDFC Bank (•••• 4521) via IMPS within 2 minutes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw Now',
          onPress: () => Alert.alert('Transfer Initiated', 'Payout request submitted successfully!'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings & Payouts</Text>
      </View>

      <FlatList
        data={earningsHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Earnings Hero Card */}
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>WITHDRAWABLE BALANCE</Text>
              <Text style={styles.heroBalance}>₹{driver.walletBalance}</Text>
              <Text style={styles.heroSub}>Includes today's fares + ₹120 in rider tips</Text>

              <TouchableOpacity
                style={styles.payoutBtn}
                onPress={handleInstantPayout}
                activeOpacity={0.85}
              >
                <Ionicons name="flash" size={18} color="#FFFFFF" />
                <Text style={styles.payoutBtnText}>Instant Bank Cashout</Text>
              </TouchableOpacity>
            </View>

            {/* Weekly Summary Metrics */}
            <View style={styles.weekCard}>
              <View style={styles.weekCol}>
                <Text style={styles.weekLabel}>THIS WEEK</Text>
                <Text style={styles.weekVal}>₹{driver.weekEarnings}</Text>
              </View>
              <View style={styles.weekDivider} />
              <View style={styles.weekCol}>
                <Text style={styles.weekLabel}>ACCEPTANCE RATE</Text>
                <Text style={styles.weekVal}>{driver.acceptanceRate}</Text>
              </View>
              <View style={styles.weekDivider} />
              <View style={styles.weekCol}>
                <Text style={styles.weekLabel}>CANCEL RATE</Text>
                <Text style={styles.weekVal}>{driver.cancellationRate}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Recent Trip Earnings</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemTopRow}>
              <View>
                <Text style={styles.itemDate}>{item.date}</Text>
                <Text style={styles.itemRoute}>{item.pickup} ➔ {item.dropoff}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.itemFare}>+₹{item.fare}</Text>
                {item.tip > 0 && <Text style={styles.itemTip}>+₹{item.tip} Tip</Text>}
              </View>
            </View>
          </View>
        )}
      />
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
  listContent: {
    padding: layout.paddingHorizontal,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: layout.radiusLg,
    padding: 20,
    marginBottom: 16,
  },
  heroLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroBalance: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    marginVertical: 8,
  },
  heroSub: {
    color: '#CBD5E1',
    fontSize: 12,
    marginBottom: 18,
  },
  payoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: layout.radiusMd,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  weekCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: layout.radiusMd,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  weekCol: {
    flex: 1,
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  weekVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  weekDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: layout.radiusMd,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDate: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemRoute: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemFare: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  itemTip: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '700',
    marginTop: 1,
  },
});
