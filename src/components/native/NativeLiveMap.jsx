import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NativeIcon from './NativeIcon';
import { LightTheme, DarkTheme, Radii, Shadows } from '../../styles/theme';

let MapView, Marker, Polyline;
try {
  const Maps = require('react-native-maps');
  MapView = Maps.default || Maps;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
} catch {}

export default function NativeLiveMap({
  trip,
  height = 240,
  isDark = false,
  showControls = true,
  style,
}) {
  const theme = isDark ? DarkTheme : LightTheme;

  // Default coordinates (e.g. Bangalore / Kochi / Mumbai)
  const pickupLat = trip?.pickup_lat || trip?.pickupCoords?.lat || 12.9716;
  const pickupLng = trip?.pickup_lng || trip?.pickupCoords?.lng || 77.5946;
  const dropLat = trip?.drop_lat || trip?.dropCoords?.lat || 12.9352;
  const dropLng = trip?.drop_lng || trip?.dropCoords?.lng || 77.6245;

  const initialRegion = {
    latitude: (pickupLat + dropLat) / 2,
    longitude: (pickupLng + dropLng) / 2,
    latitudeDelta: Math.abs(pickupLat - dropLat) * 1.5 + 0.04,
    longitudeDelta: Math.abs(pickupLng - dropLng) * 1.5 + 0.04,
  };

  if (!MapView) {
    // Graceful fallback display if native binary module is not compiled into running engine
    return (
      <View style={[styles.fallbackContainer, { height, backgroundColor: theme.card, borderColor: theme.line }, style]}>
        <View style={styles.fallbackContent}>
          <NativeIcon name="route" size={32} color={theme.yellow} />
          <Text style={[styles.fallbackTitle, { color: theme.ink }]}>Live Route Navigation</Text>
          <Text style={[styles.fallbackRoute, { color: theme.muted }]} numberOfLines={1}>
            {trip?.pickup || 'Pickup'} ➔ {trip?.drop_loc || 'Dropoff'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.mapWrapper, { height }, style]}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {/* Pickup Pin */}
        <Marker
          coordinate={{ latitude: pickupLat, longitude: pickupLng }}
          title="Pickup Location"
          description={trip?.pickup || 'Pickup point'}
        >
          <View style={[styles.pinCircle, { backgroundColor: '#10B981' }]}>
            <NativeIcon name="pin" size={14} color="#FFFFFF" />
          </View>
        </Marker>

        {/* Dropoff Pin */}
        <Marker
          coordinate={{ latitude: dropLat, longitude: dropLng }}
          title="Dropoff Location"
          description={trip?.drop_loc || 'Destination'}
        >
          <View style={[styles.pinCircle, { backgroundColor: '#EF4444' }]}>
            <NativeIcon name="pin" size={14} color="#FFFFFF" />
          </View>
        </Marker>

        {/* Route Polyline */}
        <Polyline
          coordinates={[
            { latitude: pickupLat, longitude: pickupLng },
            { latitude: dropLat, longitude: dropLng },
          ]}
          strokeColor="#FFC70A"
          strokeWidth={4}
        />
      </MapView>

      {/* Floating GPS Status Pill */}
      {showControls && (
        <View style={[styles.statusPill, { backgroundColor: theme.card }]}>
          <View style={styles.statusDot} />
          <Text style={[styles.statusText, { color: theme.ink }]}>Live GPS Connected</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    width: '100%',
    borderRadius: Radii.lg,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.card,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  pinCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Shadows.card,
  },
  statusPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    ...Shadows.card,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  fallbackContainer: {
    width: '100%',
    borderRadius: Radii.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    ...Shadows.card,
  },
  fallbackContent: {
    alignItems: 'center',
    gap: 6,
  },
  fallbackTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  fallbackRoute: {
    fontSize: 12,
  },
});
