import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';

import ridingoBlack from '../../assets/ridingo_black.png';
import ridingoWhite from '../../assets/ridingo_white.png';

/**
 * AppSplashScreen
 * Direct React Native replication of the HTML/CSS splash overlay from index.html.
 *
 * @param {boolean} isDark - Whether dark mode is active
 * @param {boolean} visible - Controls the splash screen visibility and fade-out transition
 * @param {() => void} onAnimationEnd - Callback when fade-out animation completes
 */
export default function AppSplashScreen({
  isDark = false,
  visible = true,
  onAnimationEnd,
}) {
  // Animation values for Logo Enter, Shimmer Loader, and Fade Out
  const [overlayOpacity] = useState(() => new Animated.Value(visible ? 1 : 0));
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [logoScale] = useState(() => new Animated.Value(0.94));
  const [shimmerProgress] = useState(() => new Animated.Value(0));

  // 1. Logo Enter Animation: 0.5s cubic-bezier(0.16, 1, 0.3, 1) both
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoOpacity, logoScale]);

  // 2. Shimmer Loader Animation: 1.3s cubic-bezier(0.4, 0, 0.2, 1) infinite
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerProgress, {
        toValue: 1,
        duration: 1300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerProgress]);

  // 3. Fade Out Transition: Trigger after 1200ms or when visible prop becomes false
  useEffect(() => {
    const autoDismiss = setTimeout(() => {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 450,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }).start(() => {
        if (onAnimationEnd) onAnimationEnd();
      });
    }, 1200);

    return () => clearTimeout(autoDismiss);
  }, [overlayOpacity, onAnimationEnd]);

  useEffect(() => {
    if (!visible) {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 400,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }).start(() => {
        if (onAnimationEnd) onAnimationEnd();
      });
    }
  }, [visible, overlayOpacity, onAnimationEnd]);

  // Track width is 140px. Shimmer goes from left: -45% (-63px) to 110% (154px)
  const shimmerLeft = shimmerProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-63, 31.5, 154],
  });

  const shimmerWidth = shimmerProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [49, 77, 49], // 35% (49px) -> 55% (77px) -> 35% (49px)
  });

  // Image source selection matching bundled assets
  const getImageSource = () => {
    return isDark ? ridingoWhite : ridingoBlack;
  };

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.appSplashOverlay,
        isDark ? styles.appSplashOverlayDark : styles.appSplashOverlayLight,
        { opacity: overlayOpacity },
      ]}
    >
      <View style={styles.appSplashContent}>
        {/* Animated Brand Logo */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}
        >
          <Image
            source={getImageSource()}
            style={[
              styles.appSplashLogo,
              styles.logoUser,
            ]}
            resizeMode="contain"
            accessibilityRole="image"
            accessibilityLabel="Ridingo"
          />
        </Animated.View>

        {/* Loader Track */}
        <View
          style={[
            styles.appSplashLoaderTrack,
            isDark ? styles.appSplashLoaderTrackDark : styles.appSplashLoaderTrackLight,
          ]}
        >
          {/* Shimmer Fill */}
          <Animated.View
            style={[
              styles.appSplashLoaderFill,
              {
                left: shimmerLeft,
                width: shimmerWidth,
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // .app-splash-overlay
  appSplashOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    zIndex: 9999999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Light Mode Background: #FFFFFF
  appSplashOverlayLight: {
    backgroundColor: '#FFFFFF',
  },
  // Dark Mode Background: #090A0E
  appSplashOverlayDark: {
    backgroundColor: '#090A0E',
  },

  // .app-splash-content
  appSplashContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    transform: [{ translateY: -8 }],
  },

  // Base Logo Styles (.app-splash-logo)
  appSplashLogo: {
    alignSelf: 'center',
  },

  // User App Logo: height 48px, max-width 240px
  logoUser: {
    height: 48,
    width: 240,
  },

  // .app-splash-loader-track: width 140px, height 3px, border-radius 999px
  appSplashLoaderTrack: {
    width: 140,
    height: 3,
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },
  // Light Mode Loader Track: rgba(0, 0, 0, 0.08)
  appSplashLoaderTrackLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  // Dark Mode Loader Track: rgba(255, 255, 255, 0.12)
  appSplashLoaderTrackDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },

  // .app-splash-loader-fill
  appSplashLoaderFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: '#FFC70A', // fallback base color
    ...Platform.select({
      ios: {
        shadowColor: '#FFC70A',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.55,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 0 10px rgba(255, 199, 10, 0.55)',
        background: 'linear-gradient(90deg, #FFC70A 0%, #FFA800 100%)',
      },
    }),
  },
});
