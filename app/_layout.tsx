import { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
} from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Prevent native splash from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(1)).current;
  const dot2 = useRef(new Animated.Value(1)).current;
  const dot3 = useRef(new Animated.Value(1)).current;

  // Fonts
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  /* -----------------------------
     LOADING DOT ANIMATION
  -------------------------------- */
  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1.4,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, []);

  /* -----------------------------
     APP PREPARATION
  -------------------------------- */
  useEffect(() => {
    let mounted = true;

    async function prepare() {
      try {
        const minimumSplashTime = 6000;
        const start = Date.now();

        Animated.timing(progressAnim, {
          toValue: 1,
          duration: minimumSplashTime,
          useNativeDriver: true,
        }).start();

        // Simulate resource loading
        await new Promise(resolve => setTimeout(resolve, 1200));

        const elapsed = Date.now() - start;
        const remaining = Math.max(0, minimumSplashTime - elapsed);

        if (remaining > 0) {
          await new Promise(resolve => setTimeout(resolve, remaining));
        }
      } catch (e) {
        console.warn(e);
      } finally {
        if (mounted) setAppIsReady(true);
      }
    }

    prepare();
    return () => {
      mounted = false;
    };
  }, []);

  /* -----------------------------
     SPLASH EXIT
  -------------------------------- */
  useEffect(() => {
    if (appIsReady && fontsLoaded && !fontError) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(async () => {
        setShowSplash(false);
        await SplashScreen.hideAsync();
      });
    }
  }, [appIsReady, fontsLoaded, fontError]);

  /* -----------------------------
     SPLASH SCREEN
  -------------------------------- */
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <ImageBackground
          source={require('../assets/images/tax-splash.jpg')} // <-- your TAX image
          resizeMode="contain"
          style={styles.splashImage}
        >
          <View style={styles.overlay} />

          <Animated.View
            style={[
              styles.splashContent,
              { opacity: fadeAnim },
            ]}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>₦</Text>
              </View>

              <View>
                <Text style={styles.appTitle}>Taxlator</Text>
                <Text style={styles.appTagline}>NG</Text>
              </View>
            </View>

            <Text style={styles.subtitle}>Naira Tax Calculator</Text>
            <Text style={styles.description}>
              Calculate Nigerian personal income tax with precision
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      transform: [
                        {
                          translateX: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-300, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>
            </View>

            {/* Loading Dots */}
            <View style={styles.loading}>
              <View style={styles.dots}>
                <Animated.View style={[styles.dot, { transform: [{ scale: dot1 }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ scale: dot2 }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ scale: dot3 }] }]} />
              </View>

              <Text style={styles.loadingText}>Preparing your tax calculator</Text>
              <Text style={styles.loadingSubtext}>Just a moment...</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Made for Nigeria 🇳🇬</Text>
            </View>
          </Animated.View>
        </ImageBackground>
      </View>
    );
  }

  /* -----------------------------
     APP STACK
  -------------------------------- */
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

/* -----------------------------
   STYLES
-------------------------------- */
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  splashImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
  },
  splashContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoText: {
    fontSize: 36,
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
  },
  appTitle: {
    fontSize: 44,
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
  },
  appTagline: {
    fontSize: 22,
    color: '#60a5fa',
    marginTop: -6,
    fontFamily: 'Inter_600SemiBold',
  },
  subtitle: {
    fontSize: 18,
    color: '#93c5fd',
    marginBottom: 6,
    fontFamily: 'Inter_400Regular',
  },
  description: {
    fontSize: 15,
    color: '#cbd5f5',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Inter_400Regular',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '100%',
    backgroundColor: '#60a5fa',
  },
  loading: {
    alignItems: 'center',
    marginBottom: 40,
  },
  dots: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#60a5fa',
  },
  loadingText: {
    fontSize: 15,
    color: '#c7d2fe',
    fontFamily: 'Inter_400Regular',
  },
  loadingSubtext: {
    fontSize: 13,
    color: '#c7d2fe',
    opacity: 0.7,
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    position: 'absolute',
    bottom: 36,
  },
  footerText: {
    fontSize: 13,
    color: '#c7d2fe',
    opacity: 0.8,
    fontFamily: 'Inter_400Regular',
  },
});
