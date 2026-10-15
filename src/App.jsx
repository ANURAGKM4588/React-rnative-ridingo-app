import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UserProvider } from './context/UserContext';
import { DriverProvider } from './context/DriverContext';
import UserNavigator from './apps/user/navigation/UserNavigator';
import DriverNavigator from './apps/driver/navigation/DriverNavigator';
import { colors } from './theme';

export default function App() {
  // Can be controlled via environment variable or state switcher: 'user' | 'driver'
  const initialApp =
    (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_APP_VARIANT === 'driver')
      ? 'driver'
      : 'user';

  const [activeApp, setActiveApp] = useState(initialApp);

  return (
    <SafeAreaProvider>
      <UserProvider>
        <DriverProvider>
          <View style={styles.rootContainer}>
            {/* Quick App Role Switcher Header */}
            <View style={styles.appSwitcherBar}>
              <View style={styles.brandBadge}>
                <Ionicons name="car-sport" size={16} color="#FFFFFF" />
                <Text style={styles.brandTitle}>RIDINGO</Text>
              </View>

              <View style={styles.segmentContainer}>
                <TouchableOpacity
                  style={[styles.segmentBtn, activeApp === 'user' && styles.segmentBtnActive]}
                  onPress={() => setActiveApp('user')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentText, activeApp === 'user' && styles.segmentTextActive]}>
                    Rider App
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.segmentBtn, activeApp === 'driver' && styles.segmentBtnActiveDriver]}
                  onPress={() => setActiveApp('driver')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentText, activeApp === 'driver' && styles.segmentTextActive]}>
                    Driver Partner
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Navigation Container for the Active App */}
            <NavigationContainer>
              {activeApp === 'user' ? <UserNavigator /> : <DriverNavigator />}
            </NavigationContainer>
          </View>
        </DriverProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appSwitcherBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 6 : 44,
    paddingBottom: 10,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 3,
  },
  segmentBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: colors.primary,
  },
  segmentBtnActiveDriver: {
    backgroundColor: '#2563EB',
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
});
