import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const { width } = Dimensions.get('window');

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.background}
      />

      <View style={styles.header}>
        <Text style={styles.title}>RxVerify</Text>
        <Text style={styles.subtitle}>Your Personal AI Pharmacist</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <FontAwesome name="heartbeat" size={50} color="#3b5998" style={styles.icon} />
          <Text style={styles.cardTitle}>Identify & Verify</Text>
          <Text style={styles.cardText}>
            Scan your medication packaging to verify its authenticity and check for interactions.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push('/scanner')}
        >
          <FontAwesome name="camera" size={30} color="#fff" />
          <Text style={styles.scanButtonText}>Scan Medicine</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
         <Text style={styles.footerText}>Secure • Private • Reliable</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 5,
  },
  contentContainer: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  icon: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: '#ff4757',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'transparent',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
});
