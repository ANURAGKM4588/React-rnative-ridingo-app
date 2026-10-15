import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDriver } from '../../../context/DriverContext';
import { colors, layout } from '../../../theme';

export default function DriverProfileScreen() {
  const { driver } = useDriver();
  const [autoAccept, setAutoAccept] = useState(false);
  const [audioAlerts, setAudioAlerts] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Partner Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Details Card */}
        <View style={styles.driverCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {driver.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.name}>{driver.name}</Text>
            <Text style={styles.phone}>{driver.phone}</Text>
            <Text style={styles.idBadge}>ID: {driver.id}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>{driver.rating}</Text>
          </View>
        </View>

        {/* Documents & Verifications */}
        <Text style={styles.sectionTitle}>KYC & Documents Status</Text>
        <View style={styles.groupCard}>
          <View style={styles.docRow}>
            <Ionicons name="card-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.docLabel}>Commercial Driving License</Text>
              <Text style={styles.docSub}>DL: KL-07-20160049281</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>

          <View style={styles.divider} />

          <View style={styles.docRow}>
            <Ionicons name="car-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.docLabel}>Vehicle Registration & Fitness (RC)</Text>
              <Text style={styles.docSub}>Plate: {driver.vehicleNumber}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>

          <View style={styles.divider} />

          <View style={styles.docRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.docLabel}>Comprehensive Commercial Insurance</Text>
              <Text style={styles.docSub}>Valid through Dec 2027</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
        </View>

        {/* Partner Dispatch Preferences */}
        <Text style={styles.sectionTitle}>Duty Preferences</Text>
        <View style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Auto-Accept Nearby Rides</Text>
              <Text style={styles.settingSub}>Instantly confirm bookings within 2km</Text>
            </View>
            <Switch
              value={autoAccept}
              onValueChange={setAutoAccept}
              trackColor={{ false: '#CBD5E1', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>High-Volume Voice Alerts</Text>
              <Text style={styles.settingSub}>Loud audible chime when booking arrives</Text>
            </View>
            <Switch
              value={audioAlerts}
              onValueChange={setAudioAlerts}
              trackColor={{ false: '#CBD5E1', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Partner SOS Helpline */}
        <TouchableOpacity
          style={styles.helplineBtn}
          onPress={() => Alert.alert('Driver Partner Helpline', 'Dedicated Partner Line: 1800-419-7434 (Press 1 for immediate road assist)')}
        >
          <Ionicons name="headset" size={20} color="#FFFFFF" />
          <Text style={styles.helplineBtnText}>24x7 Driver Partner Helpline</Text>
        </TouchableOpacity>
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
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: layout.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  phone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  idBadge: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
    marginTop: 2,
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  groupCard: {
    backgroundColor: colors.card,
    borderRadius: layout.radiusMd,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  docLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  docSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  helplineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: layout.radiusMd,
    paddingVertical: 15,
    gap: 10,
  },
  helplineBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
