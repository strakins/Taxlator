// app/_layout.tsx
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
  StatusBar,
} from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Prevent the splash screen from auto-hiding before our custom logic is ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(1)).current;
  const dot2 = useRef(new Animated.Value(1)).current;
  const dot3 = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  /* DOT ANIMATION FOR LOADING */
  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1.4,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, []);

  /* APP PREPARATION TIMER */
  useEffect(() => {
    // Mimic initialization work
    setTimeout(() => setAppIsReady(true), 3000);
  }, []);

  /* SPLASH EXIT LOGIC */
  useEffect(() => {
    if (appIsReady && fontsLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(async () => {
        setShowSplash(false);
        await SplashScreen.hideAsync();
      });
    }
  }, [appIsReady, fontsLoaded]);

  /* 1. CUSTOM SPLASH SCREEN UI */
  if (showSplash) {
    return (
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />

        <View style={styles.splashContainer}>
          <ImageBackground
            // Make sure this file exists in your assets/images folder!
            source={require('../assets/images/tax-splash.jpg')}
            resizeMode="cover"
            style={styles.splashImage}
          >
            <View style={styles.overlay} />

            <Animated.View style={[styles.splashContent, { opacity: fadeAnim }]}>
              <View style={styles.logoRow}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>₦</Text>
                </View>
                <Text style={styles.appTitle}>Taxlator</Text>
              </View>

              <Text style={styles.subtitle}>
                Nigerian Personal & Corporate Tax
              </Text>

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

              <View style={styles.dots}>
                <Animated.View style={[styles.dot, { transform: [{ scale: dot1 }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ scale: dot2 }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ scale: dot3 }] }]} />
              </View>

              <Text style={styles.footer}>Made for Nigeria 🇳🇬</Text>
            </Animated.View>
          </ImageBackground>
        </View>
      </SafeAreaProvider>
    );
  }

  /* 2. ACTUAL APP NAVIGATION STACK */
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#ffffff"
          translucent={false}
        />

        <Stack screenOptions={{ headerShown: false }}>
          {/* Main entry is the drawer navigator */}
          <Stack.Screen name="(drawer)" />

          {/* Error handling for missing routes */}
          <Stack.Screen
            name="+not-found"
            options={{
              headerShown: true,
              title: 'Page Not Found',
              headerTitleStyle: { fontFamily: 'Inter_700Bold' }
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1 },
  splashImage: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.9)', // Slightly darker overlay
  },
  splashContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(96,165,250,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 30,
    color: '#60a5fa',
    fontFamily: 'Inter_700Bold',
  },
  appTitle: {
    fontSize: 40,
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    color: '#93c5fd',
    marginBottom: 30,
    fontFamily: 'Inter_400Regular',
  },
  progressBackground: {
    width: '80%',
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressFill: {
    height: '100%',
    width: '100%',
    backgroundColor: '#60a5fa',
  },
  dots: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#60a5fa',
  },
  footer: {
    color: '#c7d2fe',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});