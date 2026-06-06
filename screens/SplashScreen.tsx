import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';

const { height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(-30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const loaderWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(loaderWidth, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setTimeout(onFinish, 300);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── TOP SECTION: Logo ── */}
      <View style={styles.topSection}>
        <Animated.View
          style={[
            styles.logoContainer,
            { opacity: logoOpacity, transform: [{ translateY: logoTranslateY }] },
          ]}
        >
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Voyagez. Explorez. Vivez.
        </Animated.Text>
      </View>

      {/* ── BOTTOM SECTION: Loading bar ── */}
      <Animated.View style={[styles.bottomSection, { opacity: loaderOpacity }]}>
        <Text style={styles.loadingLabel}>Chargement...</Text>

        <View style={styles.loaderTrack}>
          <Animated.View
            style={[
              styles.loaderFill,
              {
                width: loaderWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: height * 0.12,
    paddingBottom: height * 0.1,
    paddingHorizontal: 40,
  },

  topSection: {
    alignItems: 'center',
    gap: 16,
  },

  logoContainer: {
    alignItems: 'center',
    gap: 20,
  },

  logoImage: {
    width: 180,
    height: 180,
  },

  tagline: {
    fontSize: 14,
    color: '#9A9AB0',
    letterSpacing: 2,
    marginTop: 8,
    fontStyle: 'italic',
  },

  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },

  loadingLabel: {
    fontSize: 12,
    color: '#9A9AB0',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  loaderTrack: {
    width: '100%',
    height: 3,
    backgroundColor: '#E8E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },

  loaderFill: {
    height: '100%',
    backgroundColor: '#1C6BF4',
    borderRadius: 2,
  },
});

export default SplashScreen;