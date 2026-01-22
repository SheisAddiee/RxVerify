import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/components/Themed';
import { MEDICATION_DATABASE, Medication } from '@/constants/medications';
import { saveScan } from '@/utils/storage';

export default function ResultScreen() {
  const { medicationId } = useLocalSearchParams();
  const [medication, setMedication] = useState<Medication | null>(null);

  useEffect(() => {
    const id = Array.isArray(medicationId) ? medicationId[0] : medicationId;
    const med = MEDICATION_DATABASE.find(m => m.id === id);
    if (med) {
      setMedication(med);
      saveScan(med);
    }
  }, [medicationId]);

  if (!medication) {
      return (
          <View style={styles.loadingContainer}>
              <Text>Loading or Medication Not Found...</Text>
              <TouchableOpacity style={styles.homeButton} onPress={() => router.navigate('/')}>
                <Text style={styles.homeButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
      )
  }

  const isSafe = medication.type === 'safe';
  const statusColor = isSafe ? '#4cd137' : '#e84118';
  const statusIcon = isSafe ? 'check-circle' : 'exclamation-triangle';
  const statusText = isSafe ? 'VERIFIED SAFE' : 'POTENTIAL RISK';

  return (
    <View style={styles.container}>
        <LinearGradient
            colors={isSafe ? ['#4cd137', '#2ed573'] : ['#e84118', '#c23616']}
            style={styles.header}
        >
            <View style={styles.headerContent}>
                <FontAwesome name={statusIcon} size={60} color="#fff" />
                <Text style={styles.statusText}>{statusText}</Text>
            </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
             <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.medName}>{medication.name}</Text>

                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Usage Instructions</Text>
                        <Text style={styles.sectionContent}>{medication.usage}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: '#e84118' }]}>Warnings & Interactions</Text>
                        {medication.warnings.map((warning, index) => (
                            <View key={index} style={styles.warningRow}>
                                <FontAwesome name="warning" size={16} color="#e84118" style={{marginTop: 2, marginRight: 8}} />
                                <Text style={styles.warningText}>{warning}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={[styles.homeButton, { backgroundColor: statusColor }]} onPress={() => router.navigate('/')}>
                    <Text style={styles.homeButtonText}>Back to Dashboard</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  header: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
      alignItems: 'center',
      marginTop: 20,
  },
  statusText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    letterSpacing: 1,
  },
  contentContainer: {
      flex: 1,
      marginTop: -50,
      alignItems: 'center',
  },
  content: {
    width: '100%',
  },
  scrollContent: {
      alignItems: 'center',
      paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    width: width * 0.9,
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.20,
    shadowRadius: 5.62,
    elevation: 8,
    marginBottom: 20,
  },
  medName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
      height: 1,
      backgroundColor: '#eee',
      marginVertical: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 16,
    color: '#d63031',
    flex: 1,
  },
  homeButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: width * 0.8,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
