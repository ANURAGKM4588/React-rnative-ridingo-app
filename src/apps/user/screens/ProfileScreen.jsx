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
import { useUser } from '../../../context/UserContext';
import { colors, layout } from '../../../theme';

export default function ProfileScreen() {
  const { user } = useUser();
  const [quietRide, setQuietRide] = useState(user.preferences?.quietRide || true);
  const [acPreCool, setAcPreCool] = useState(user.preferences?.preCool || true);

  const handleSos = () => {
    Alert.alert(
      'Emergency SOS Triggered',
      `Emergency alert and live GPS location dispatched to: \n${user.sosContacts[0].name} (${user.sosContacts[0].phone})\nand 24x7 Safety Helpline 112.`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account & Safety</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>{user.rating}</Text>
          </View>
        </View>

        {/* Emergency SOS Button */}
        <TouchableOpacity style={styles.sosBanner} onPress={handleSos} activeOpacity={0.85}>
          <Ionicons name="warning" size={24} color="#FFFFFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.sosTitle}>Emergency 24x7 SOS</Text>
            <Text style={styles.sosSub}>Tap to notify {user.sosContacts[0]?.name} & Police</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Ride Comfort Preferences */}
        <Text style={styles.sectionTitle}>Ride Comfort & Preferences</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Quiet Cabin</Text>
              <Text style={styles.settingSub}>Request driver to keep conversations minimal</Text>
            </View>
            <Switch
              value={quietRide}
              onValueChange={setQuietRide}
              trackColor={{ false: '#CBD5E1', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>AC Pre-Cool (22°C)</Text>
              <Text style={styles.settingSub}>Cabin chilled before you step inside</Text>
            </View>
            <Switch
              value={acPreCool}
              onValueChange={setAcPreCool}
              trackColor={{ false: '#CBD5E1', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* General Options */}
        <Text style={styles.sectionTitle}>Support & About</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Safety Center', 'Ridingo Safety features: Verified Drivers, Live GPS Sharing, SOS Alert.')}
          >
            <Ionicons name="shield-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.actionLabel}>Safety Center</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Customer Care', 'Toll Free: 1800-419-7433\nEmail: support@ridingo.in')}
          >
            <Ionicons name="headset-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.actionLabel}>24x7 Help & Customer Care</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Legal', 'Terms of Service & Privacy Policy v1.0.0')}
          >
            <Ionicons name="document-text-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.actionLabel}>Legal & Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: layout.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userPhone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
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
  sosBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: layout.radiusMd,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  sosTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  sosSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: colors.card,
    borderRadius: layout.radiusMd,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 12,
  },
  actionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});
