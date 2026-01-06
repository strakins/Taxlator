import { useEffect, useState, useRef } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  // Create refs for animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dotScale1 = useRef(new Animated.Value(1)).current;
  const dotScale2 = useRef(new Animated.Value(1)).current;
  const dotScale3 = useRef(new Animated.Value(1)).current;

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    // Animate loading dots (sequence animation)
    const createDotAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start dot animations
    createDotAnimation(dotScale1, 0).start();
    createDotAnimation(dotScale2, 200).start();
    createDotAnimation(dotScale3, 400).start();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function prepare() {
      try {
        // Minimum splash screen duration: 1500ms
        const minimumSplashTime = 2000;
        const startTime = Date.now();

        // Animate progress bar from 0 to 100% over minimum splash time
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: minimumSplashTime,
          useNativeDriver: true,
        }).start();

        // Load any resources here
        await Promise.all([
          // Simulate loading of resources
          new Promise(resolve => setTimeout(resolve, 1000)),
        ]);

        // Calculate remaining time to meet minimum splash duration
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minimumSplashTime - elapsed);
        
        if (remaining > 0) {
          await new Promise(resolve => setTimeout(resolve, remaining));
        }

      } catch (e) {
        console.warn(e);
      } finally {
        if (isMounted) {
          setAppIsReady(true);
        }
      }
    }

    prepare();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (appIsReady && fontsLoaded && !fontError) {
      // Fade out animation after a brief delay
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowSplash(false);
          SplashScreen.hideAsync();
        });
      }, 300);
    }
  }, [appIsReady, fontsLoaded, fontError]);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Animated.View 
          style={[
            styles.splashContent,
            { opacity: fadeAnim }
          ]}
        >
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>₦</Text>
            </View>
            <View style={styles.appTitleContainer}>
              <Text style={styles.appTitle}>Taxlator</Text>
              <Text style={styles.appTagline}>NG</Text>
            </View>
          </View>
          
          {/* App Description */}
          <Text style={styles.splashSubtitle}>Naira Tax Calculator</Text>
          <Text style={styles.splashDescription}>
            Calculate Nigerian personal income tax with precision
          </Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View 
                style={[
                  styles.progressBarFill,
                  {
                    transform: [{
                      translateX: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-100, 0], // Animate from left to right
                      })
                    }],
                    width: '100%',
                  }
                ]} 
              />
            </View>
          </View>
          
          {/* Loading Animation */}
          <View style={styles.loadingSection}>
            <View style={styles.loadingDots}>
              <Animated.View style={[
                styles.dot, 
                { transform: [{ scale: dotScale1 }] }
              ]} />
              <Animated.View style={[
                styles.dot, 
                { transform: [{ scale: dotScale2 }] }
              ]} />
              <Animated.View style={[
                styles.dot, 
                { transform: [{ scale: dotScale3 }] }
              ]} />
            </View>
            
            <Text style={styles.loadingText}>Preparing your tax calculator</Text>
            <Text style={styles.loadingSubtext}>Just a moment...</Text>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made for Nigeria 🇳🇬</Text>
          </View>
        </Animated.View>
      </View>
    );
  }

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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  appTitleContainer: {
    alignItems: 'flex-start',
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Inter_700Bold',
  },
  appTagline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginTop: -8,
    fontFamily: 'Inter_600SemiBold',
  },
  splashSubtitle: {
    fontSize: 20,
    color: '#93c5fd',
    marginBottom: 8,
    fontFamily: 'Inter_400Regular',
  },
  splashDescription: {
    fontSize: 16,
    color: '#93c5fd',
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    opacity: 0.9,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#60a5fa',
    borderRadius: 3,
  },
  loadingSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#60a5fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#93c5fd',
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#93c5fd',
    fontFamily: 'Inter_400Regular',
    opacity: 0.7,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#93c5fd',
    fontFamily: 'Inter_400Regular',
    opacity: 0.8,
  },
});