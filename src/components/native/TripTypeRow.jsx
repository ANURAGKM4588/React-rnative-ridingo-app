import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import NativeIcon from './NativeIcon';
import { LightTheme, DarkTheme } from '../../styles/theme';

const DEFAULT_TRIP_TYPES = [
  { id: 'hourly', label: 'Hourly', icon: 'clock' },
  { id: 'fullday', label: 'Full day', icon: 'sun' },
  { id: 'airport', label: 'Airport', icon: 'plane' },
  { id: 'outstation', label: 'Outstation', icon: 'navigation' },
];

/**
 * TripTypeRow - Pure React Native Component
 * Features an animating pill background that slides smoothly
 * across the selected option using Animated.View and translateX / interpolate.
 */
export default function TripTypeRow({
  options = DEFAULT_TRIP_TYPES,
  selectedId = 'hourly',
  onSelect,
  isDark = false,
  containerStyle,
}) {
  const theme = isDark ? DarkTheme : LightTheme;
  const [animValue] = useState(() => new Animated.Value(0));
  const [tabLayouts, setTabLayouts] = useState({});

  const selectedIndex = Math.max(
    0,
    options.findIndex((opt) => opt.id === selectedId)
  );

  // Trigger smooth spring animation whenever selectedIndex changes
  useEffect(() => {
    Animated.spring(animValue, {
      toValue: selectedIndex,
      useNativeDriver: Platform.OS !== 'web',
      tension: 68,
      friction: 10,
    }).start();
  }, [selectedIndex, animValue]);

  const handleTabLayout = (index, event) => {
    const { x, width, height } = event.nativeEvent.layout;
    setTabLayouts((prev) => {
      if (prev[index]?.x === x && prev[index]?.width === width) return prev;
      return {
        ...prev,
        [index]: { x, width, height },
      };
    });
  };

  const hasAllLayouts = options.length > 0 && options.every((_, i) => tabLayouts[i]);

  const translateX = useMemo(() => {
    if (!hasAllLayouts) return 0;
    return animValue.interpolate({
      inputRange: options.map((_, i) => i),
      outputRange: options.map((_, i) => tabLayouts[i]?.x || 0),
    });
  }, [hasAllLayouts, options, tabLayouts, animValue]);

  const pillWidth = useMemo(() => {
    if (!hasAllLayouts) return undefined;
    return animValue.interpolate({
      inputRange: options.map((_, i) => i),
      outputRange: options.map((_, i) => tabLayouts[i]?.width || 0),
    });
  }, [hasAllLayouts, options, tabLayouts, animValue]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.rowWrapper,
          {
            backgroundColor: isDark ? '#1E293B' : theme.surface,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : theme.line,
          },
        ]}
      >
        {/* Smoothly Sliding Pill Background */}
        {hasAllLayouts && (
          <Animated.View
            style={[
              styles.slidingPill,
              {
                backgroundColor: isDark ? '#FFFFFF' : '#0F172A',
                width: pillWidth,
                transform: [{ translateX }],
              },
            ]}
          />
        )}

        {/* Tab Items */}
        {options.map((option, index) => {
          const isSelected = option.id === selectedId;
          const activeTextColor = isDark ? '#0F172A' : '#FFFFFF';
          const inactiveTextColor = isDark ? '#94A3B8' : '#64748B';
          const iconColor = isSelected ? activeTextColor : inactiveTextColor;

          return (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.8}
              onPress={() => onSelect && onSelect(option.id)}
              onLayout={(e) => handleTabLayout(index, e)}
              style={styles.tabButton}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={option.label}
            >
              <View style={styles.tabContent}>
                {option.icon && (
                  <NativeIcon
                    name={option.icon}
                    size={16}
                    color={iconColor}
                    strokeWidth={2.2}
                  />
                )}
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isSelected ? activeTextColor : inactiveTextColor,
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 6,
  },
  rowWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
  },
  slidingPill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 999,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    zIndex: 2,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabLabel: {
    fontSize: 13,
    letterSpacing: -0.2,
  },
});
