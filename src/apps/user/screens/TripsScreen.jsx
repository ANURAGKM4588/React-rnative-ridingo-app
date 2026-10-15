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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';
import { colors, layout } from '../../../theme';

export default function TripsScreen() {
  const { trips } = useUser();

  const handleInvoice = (item) => {
    Alert.alert(
      'Trip Receipt & Invoice',
      `Trip ID: ${item.id}\nDriver: ${item.driverName || 'Ravi Kumar'}\nFare: ₹${item.fare}\nPayment: ${item.paymentMethod || 'UPI'}\n\nInvoice PDF generated successfully.`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Rides & Activity</Text>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.tripCard}>
            <View style={styles.topRow}>
              <View style={styles.dateCol}>
                <Text style={styles.dateText}>{item.date || 'Recent Ride'}</Text>
                <Text style={styles.vehicleText}>{item.vehicle || 'Prime Sedan'}</Text>
              </View>
              <View style={styles.fareCol}>
                <Text style={styles.fareText}>₹{item.fare || 290}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{item.status || 'Completed'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Pickup / Drop info */}
            <View style={styles.routeCol}>
              <View style={styles.routeItem}>
                <View style={styles.dotGreen} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.pickup || 'Pickup location'}
                </Text>
              </View>
              <View style={styles.routeItem}>
                <View style={styles.dotRed} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.dropoff || 'Dropoff location'}
                </Text>
              </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.actionRow}>
              <View style={styles.driverMeta}>
                <Ionicons name="person-circle-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.driverNameText}>{item.driverName || 'Ravi Kumar'}</Text>
              </View>
              <TouchableOpacity
                style={styles.receiptBtn}
                onPress={() => handleInvoice(item)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="file-document-outline" size={16} color={colors.primaryDark} />
                <Text style={styles.receiptBtnText}>Receipt</Text>
              </TouchableOpacity>
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
    gap: 14,
  },
  tripCard: {
    backgroundColor: colors.card,
    borderRadius: layout.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateCol: {},
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  vehicleText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  fareCol: {
    alignItems: 'flex-end',
  },
  fareText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  routeCol: {
    gap: 8,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  locationText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: colors.borderLight,
  },
  driverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  driverNameText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: layout.radiusSm,
  },
  receiptBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
