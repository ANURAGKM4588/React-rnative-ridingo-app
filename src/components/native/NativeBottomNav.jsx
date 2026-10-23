import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import NativeIcon from './NativeIcon';
import { LightTheme, DarkTheme } from '../../styles/theme';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'trips', label: 'History', icon: 'history' },
  { id: 'wallet', label: 'Wallet', icon: 'wallet' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

export default function NativeBottomNav({
  activeTab = 'home',
  onSelectTab,
  isDark = false,
  visible = true,
}) {
  if (!visible) return null;

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <View style={[styles.navContainer, { backgroundColor: theme.card, borderTopColor: theme.line }]}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const iconColor = isActive ? theme.ink : theme.muted;
        const textColor = isActive ? theme.ink : theme.muted;

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => onSelectTab && onSelectTab(item.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={item.label}
          >
            <View style={styles.iconWrap}>
              <NativeIcon
                name={item.icon}
                size={22}
                color={iconColor}
                filled={isActive}
              />
            </View>
            <Text style={[styles.navLabel, { color: textColor }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: Platform.OS === 'ios' ? 76 : 60,
    paddingBottom: Platform.OS === 'ios' ? 16 : 4,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth * 1.5,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  navItem: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.1,
    marginTop: 2,
  },
});
