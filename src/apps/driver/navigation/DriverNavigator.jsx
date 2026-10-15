import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DriverDashboardScreen from '../screens/DriverDashboardScreen';
import DriverEarningsScreen from '../screens/DriverEarningsScreen';
import DriverProfileScreen from '../screens/DriverProfileScreen';
import { colors } from '../../../theme';

const Tab = createBottomTabNavigator();

export default function DriverNavigator() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#059669',
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ color, focused }) => {
            let iconName;
            if (route.name === 'Duty') {
              iconName = focused ? 'speedometer' : 'speedometer-outline';
            } else if (route.name === 'Earnings') {
              iconName = focused ? 'cash' : 'cash-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Duty" component={DriverDashboardScreen} />
        <Tab.Screen name="Earnings" component={DriverEarningsScreen} />
        <Tab.Screen name="Profile" component={DriverProfileScreen} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: colors.border,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
