import { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 2500);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#f6f8f8', '#eef3f3']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.pill} />
            <View style={[styles.pill, styles.pill2]} />
            <Text style={styles.check}>✓</Text>
          </View>
          <Text style={styles.title}>
            Rx<Text style={styles.primary}>Verify</Text>
          </Text>
          <View style={styles.subtitleContainer}>
            <View style={styles.line} />
            <Text style={styles.subtitle}>AI PILL ANALYSIS</Text>
            <View style={styles.line} />
          </View>
        </View>
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#0fbdbd" />
          <Text style={styles.footerText}>Initializing secure analysis environment...</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 144,
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  pill: {
    position: 'absolute',
    width: 112,
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#0d7b7b',
    transform: [{ rotate: '45deg' }],
  },
  pill2: {
    backgroundColor: '#22d3ee',
    opacity: 0.5,
    transform: [{ rotate: '-45deg' }],
  },
  check: {
    fontSize: 64,
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 46,
    fontWeight: '800',
    color: '#0a1a1a',
  },
  primary: {
    color: '#0fbdbd',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  line: {
    width: 16,
    height: 1,
    backgroundColor: 'rgba(15, 189, 189, 0.3)',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#517a7a',
    letterSpacing: 2,
    marginHorizontal: 8,
  },
  footer: {
    paddingBottom: 64,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 10,
    color: '#a0bcbc',
  },
});
