import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import NativeIcon from './NativeIcon';
import { LightTheme, DarkTheme, Typography, Radii, Shadows } from '../../styles/theme';
import ridingoBlack from '../../assets/ridingo_black.png';
import ridingoWhite from '../../assets/ridingo_white.png';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'hourly', name: 'Hourly Driver', blurb: '2 to 12 hours', icon: 'clock', from: '₹250/hr', badge: 'RECOMMENDED' },
  { id: 'daily', name: 'Full Day', blurb: '10 hours a day', icon: 'sun', from: '₹1,800/day' },
  { id: 'airport', name: 'Airport Transfer', blurb: 'Terminal drop & pickup', icon: 'plane', from: '₹900 flat' },
  { id: 'outstation', name: 'Outstation Trip', blurb: 'Inter-city multi-day', icon: 'route', from: '₹2,200/day' },
  { id: 'event', name: 'Night & Events', blurb: 'Late party / wedding', icon: 'moon', from: '₹350/hr' },
];

const REVIEWS = [
  {
    name: 'Arjun Mehta',
    car: 'BMW 330i Gran Limousine',
    tag: 'Hourly Driver',
    quote: 'Handed over my keys for a city dinner. Rajesh drove so smoothly and parked with extreme care.',
  },
  {
    name: 'Priya Nair',
    car: 'Hyundai Creta SX(O)',
    tag: 'Airport Transfer',
    quote: 'Needed a 4:30 AM terminal drop. Vikram arrived 10 mins early in uniform and handled our luggage.',
  },
  {
    name: 'Karan Singhania',
    car: 'Toyota Fortuner 4x4',
    tag: 'Outstation Trip',
    quote: 'Hired Suresh for a 2-day family trip through the hills. Handled hairpin bends effortlessly.',
  },
];

export default function NativeHomeTab({
  user,
  trips = [],
  onOpenBooking,
  onOpenLiveTracking,
  onOpenNotifications,
  isDark = false,
}) {
  const theme = isDark ? DarkTheme : LightTheme;
  const [searchQuery, setSearchQuery] = useState('');

  const userName = user?.firstName || (user?.name ? user.name.split(' ')[0] : 'there');
  const greetingName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const [dismissedTripIds, setDismissedTripIds] = useState([]);
  const [tripRatings, setTripRatings] = useState({});
  const [tripReviews, setTripReviews] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  // Active or recently completed unreviewed trips
  const activeTrips = (trips || []).filter(t => {
    if (dismissedTripIds.includes(t.id)) return false;
    if (['inprogress', 'ready_to_start', 'pickup_arrived', 'accepted', 'requested'].includes(t.status)) return true;
    if (t.status === 'completed') return true;
    return false;
  });

  const handleNativeSubmitRating = (trip) => {
    const star = tripRatings[trip.id] || 5;
    const review = tripReviews[trip.id] || '';
    setSubmittedReviews(prev => ({ ...prev, [trip.id]: { rating: star, review } }));
  };

  const handleDismissNativeTrip = (tripId) => {
    setDismissedTripIds(prev => [...prev, tripId]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.surface }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Bar with Brand Logo and Notification Bell */}
      <View style={styles.topBar}>
        <Image
          source={isDark ? ridingoWhite : ridingoBlack}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.line }]}
          onPress={onOpenNotifications}
          activeOpacity={0.7}
          accessibilityLabel="Notifications"
        >
          <NativeIcon name="bell" size={18} color={theme.ink} />
        </TouchableOpacity>
      </View>

      {/* 2. Hero Greeting */}
      <View style={styles.greetingSection}>
        <Text style={[styles.greetingTitle, { color: theme.ink }]}>
          Hi, {greetingName}
        </Text>
        <Text style={[styles.greetingSub, { color: theme.muted }]}>
          Need a driver for your own car?
        </Text>
      </View>

      {/* 3. Destination Search Bar */}
      <TouchableOpacity
        style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.line }]}
        activeOpacity={0.85}
        onPress={() => onOpenBooking && onOpenBooking('hourly')}
      >
        <NativeIcon name="search" size={18} color={theme.muted} style={styles.searchIcon} />
        <TextInput
          placeholder="Where are you heading today?"
          placeholderTextColor={theme.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: theme.ink }]}
          editable={false} // Tapping opens booking sheet directly
        />
        <View style={[styles.searchBadge, { backgroundColor: theme.yellow }]}>
          <Text style={styles.searchBadgeText}>Go</Text>
        </View>
      </TouchableOpacity>

      {/* 4. Active Trip Banner (if any trip active) */}
      {activeTrips.length > 0 && (
        <View style={styles.activeTripsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.liveIndicatorRow}>
              <View style={[styles.liveDot, { backgroundColor: theme.accentGreen }]} />
              <Text style={[styles.sectionTitle, { color: theme.ink }]}>Live Trip</Text>
            </View>
            <Text style={[styles.liveBadge, { color: theme.accentGreen, backgroundColor: theme.accentGreenSoft }]}>
              GPS Active
            </Text>
          </View>

          {activeTrips.map((trip) => {
            const isCompleted = trip.status === 'completed';
            const isSubmitted = submittedReviews[trip.id] || trip.rating || trip.userRating;
            const currentRating = tripRatings[trip.id] || 5;
            const driverName = (typeof trip.driver === 'string' ? trip.driver : trip.driver?.name) || 'Ravi Kumar';

            if (isCompleted) {
              return (
                <View
                  key={trip.id}
                  style={[styles.activeTripCard, { backgroundColor: theme.card, borderColor: '#10B981', borderWidth: 1.5 }]}
                >
                  <View style={styles.activeTripHeader}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <View style={{ backgroundColor: '#10B981', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 }}>
                          <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>COMPLETED</Text>
                        </View>
                        <Text style={[styles.tripRoute, { color: theme.ink, flex: 1 }]} numberOfLines={1}>
                          {trip.pickup || 'Pickup'} ➔ {trip.drop_loc || 'Drop-off'}
                        </Text>
                      </View>
                      <Text style={[styles.tripStatusText, { color: theme.muted }]}>
                        Driver: {driverName} · ₹{trip.fare || 750}
                      </Text>
                    </View>
                  </View>

                  {isSubmitted ? (
                    <View style={{ marginTop: 10, padding: 12, borderRadius: 10, backgroundColor: theme.surface, alignItems: 'center' }}>
                      <Text style={{ color: '#F59E0B', fontSize: 18, marginBottom: 4 }}>★★★★★</Text>
                      <Text style={{ color: theme.ink, fontWeight: '700', fontSize: 13 }}>Thank you for reviewing {driverName}!</Text>
                      <TouchableOpacity
                        style={[styles.trackButton, { backgroundColor: theme.solid, marginTop: 8 }]}
                        onPress={() => handleDismissNativeTrip(trip.id)}
                      >
                        <Text style={[styles.trackButtonText, { color: theme.onSolid }]}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ color: theme.ink, fontWeight: '700', fontSize: 12, marginBottom: 6 }}>
                        Rate Your Driver Experience
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <TouchableOpacity
                            key={star}
                            onPress={() => setTripRatings(prev => ({ ...prev, [trip.id]: star }))}
                          >
                            <Text style={{ fontSize: 24, color: star <= currentRating ? '#F59E0B' : theme.line }}>
                              ★
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <TextInput
                        value={tripReviews[trip.id] || ''}
                        onChangeText={(txt) => setTripReviews(prev => ({ ...prev, [trip.id]: txt }))}
                        placeholder={`Write a review for ${driverName}...`}
                        placeholderTextColor={theme.muted}
                        style={{
                          borderWidth: 1,
                          borderColor: theme.line,
                          borderRadius: 8,
                          padding: 8,
                          fontSize: 12,
                          color: theme.ink,
                          backgroundColor: theme.surface,
                          marginBottom: 10
                        }}
                      />

                      <TouchableOpacity
                        style={[styles.trackButton, { backgroundColor: '#10B981' }]}
                        onPress={() => handleNativeSubmitRating(trip)}
                      >
                        <NativeIcon name="check" size={14} color="#FFFFFF" />
                        <Text style={[styles.trackButtonText, { color: '#FFFFFF' }]}>
                          Submit Review
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={trip.id}
                style={[styles.activeTripCard, { backgroundColor: theme.card, borderColor: theme.line }]}
                activeOpacity={0.9}
                onPress={() => onOpenLiveTracking && onOpenLiveTracking(trip.id)}
              >
                <View style={styles.activeTripHeader}>
                  <View>
                    <Text style={[styles.tripRoute, { color: theme.ink }]}>
                      {trip.pickup || 'Current Location'} ➔ {trip.drop_loc || 'Destination'}
                    </Text>
                    <Text style={[styles.tripStatusText, { color: theme.muted }]}>
                      {trip.status === 'inprogress' ? 'Trip in progress' : 'Driver en route'} · ₹{trip.fare || 450}
                    </Text>
                  </View>
                  <NativeIcon name="chevronRight" size={18} color={theme.muted} />
                </View>

                <TouchableOpacity
                  style={[styles.trackButton, { backgroundColor: theme.solid }]}
                  onPress={() => onOpenLiveTracking && onOpenLiveTracking(trip.id)}
                >
                  <NativeIcon name="navigation" size={14} color={theme.onSolid} />
                  <Text style={[styles.trackButtonText, { color: theme.onSolid }]}>
                    Track Driver on Map
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* 5. Services Header */}
      <View style={styles.servicesHeader}>
        <Text style={[styles.sectionTitle, { color: theme.ink }]}>
          Hire a verified driver
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.muted }]}>
          Trained on luxury sedans, automatics, & manual SUVs
        </Text>
      </View>

      {/* 6. Hourly Driver (Hero Bento Card) */}
      <TouchableOpacity
        style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.line }]}
        activeOpacity={0.88}
        onPress={() => onOpenBooking && onOpenBooking('hourly')}
      >
        <View style={styles.heroCardTop}>
          <View style={[styles.recommendedBadge, { backgroundColor: theme.yellow }]}>
            <Text style={styles.recommendedBadgeText}>MOST POPULAR</Text>
          </View>
          <Text style={[styles.heroPrice, { color: theme.ink }]}>₹250/hr</Text>
        </View>

        <View style={styles.heroCardBody}>
          <View style={[styles.categoryIconWrap, { backgroundColor: theme.surface }]}>
            <NativeIcon name="clock" size={26} color={theme.ink} />
          </View>
          <View style={styles.heroTextContent}>
            <Text style={[styles.categoryTitle, { color: theme.ink }]}>Hourly Driver</Text>
            <Text style={[styles.categoryBlurb, { color: theme.muted }]}>
              Pay strictly for the hours you use. Perfect for dining, shopping & hospital visits.
            </Text>
          </View>
        </View>

        <View style={[styles.heroCardFooter, { borderTopColor: theme.line }]}>
          <Text style={[styles.bookNowText, { color: theme.ink }]}>Book Hourly Driver</Text>
          <NativeIcon name="chevronRight" size={16} color={theme.ink} />
        </View>
      </TouchableOpacity>

      {/* 7. Grid for Other Categories */}
      <View style={styles.categoryGrid}>
        {CATEGORIES.filter(c => c.id !== 'hourly').map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.gridCard, { backgroundColor: theme.card, borderColor: theme.line }]}
            activeOpacity={0.88}
            onPress={() => onOpenBooking && onOpenBooking(cat.id)}
          >
            <View style={[styles.gridIconWrap, { backgroundColor: theme.surface }]}>
              <NativeIcon name={cat.icon} size={20} color={theme.ink} />
            </View>
            <Text style={[styles.gridTitle, { color: theme.ink }]}>{cat.name}</Text>
            <Text style={[styles.gridBlurb, { color: theme.muted }]}>{cat.blurb}</Text>
            <Text style={[styles.gridPrice, { color: theme.ink }]}>{cat.from}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 8. Trust & Verified Safety Banner */}
      <View style={[styles.safetyCard, { backgroundColor: theme.card, borderColor: theme.line }]}>
        <View style={[styles.safetyIconWrap, { backgroundColor: theme.accentGreenSoft }]}>
          <NativeIcon name="shield" size={24} color={theme.accentGreen} />
        </View>
        <View style={styles.safetyTextWrap}>
          <Text style={[styles.safetyTitle, { color: theme.ink }]}>100% Police Verified Drivers</Text>
          <Text style={[styles.safetySub, { color: theme.muted }]}>
            Every driver undergoes rigorous driving assessments and criminal background verification.
          </Text>
        </View>
      </View>

      {/* 9. Customer Reviews */}
      <View style={styles.reviewsSection}>
        <Text style={[styles.sectionTitle, { color: theme.ink }]}>Customer Reviews</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewsScroll}>
          {REVIEWS.map((rev, i) => (
            <View
              key={i}
              style={[styles.reviewCard, { backgroundColor: theme.card, borderColor: theme.line }]}
            >
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <NativeIcon key={s} name="star" size={14} color={theme.yellow} />
                ))}
              </View>
              <Text style={[styles.reviewQuote, { color: theme.ink }]} numberOfLines={4}>
                "{rev.quote}"
              </Text>
              <View style={styles.reviewAuthor}>
                <Text style={[styles.reviewName, { color: theme.ink }]}>{rev.name}</Text>
                <Text style={[styles.reviewCar, { color: theme.muted }]}>{rev.car}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logo: {
    height: 32,
    width: 130,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: Radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  greetingSection: {
    marginBottom: 14,
  },
  greetingTitle: {
    ...Typography.title1,
  },
  greetingSub: {
    ...Typography.body,
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.lg,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
    ...Shadows.card,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    padding: 0,
  },
  searchBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radii.pill,
  },
  searchBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },
  activeTripsSection: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    ...Typography.title2,
  },
  sectionSubtitle: {
    ...Typography.caption,
    marginTop: 2,
  },
  liveBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.pill,
  },
  activeTripCard: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    ...Shadows.card,
  },
  activeTripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tripRoute: {
    fontSize: 14,
    fontWeight: '700',
  },
  tripStatusText: {
    fontSize: 12,
    marginTop: 3,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: Radii.sm,
    gap: 8,
  },
  trackButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  servicesHeader: {
    marginBottom: 12,
  },
  heroCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    ...Shadows.card,
  },
  heroCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recommendedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  recommendedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.4,
  },
  heroPrice: {
    fontSize: 14,
    fontWeight: '800',
  },
  heroCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryIconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroTextContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryBlurb: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
  },
  heroCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  bookNowText: {
    fontSize: 13,
    fontWeight: '700',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  gridCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 14,
    ...Shadows.card,
  },
  gridIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  gridBlurb: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 8,
    minHeight: 28,
  },
  gridPrice: {
    fontSize: 12,
    fontWeight: '800',
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 14,
    marginBottom: 22,
    ...Shadows.card,
  },
  safetyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  safetyTextWrap: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  safetySub: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  reviewsSection: {
    marginBottom: 16,
  },
  reviewsScroll: {
    marginTop: 10,
  },
  reviewCard: {
    width: SCREEN_WIDTH * 0.72,
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 14,
    marginRight: 12,
    ...Shadows.card,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 8,
  },
  reviewQuote: {
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  reviewAuthor: {
    marginTop: 10,
  },
  reviewName: {
    fontSize: 12,
    fontWeight: '700',
  },
  reviewCar: {
    fontSize: 10.5,
    marginTop: 1,
  },
});
