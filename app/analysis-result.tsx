import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const CounterIndicationItem = ({
  icon,
  title,
  description,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
}) => (
  <View style={styles.indicationItem}>
    <View style={[styles.indicationIconContainer, { backgroundColor: `${color}1A` }]}>
      <MaterialIcons name={icon} size={18} color={color} />
    </View>
    <View>
      <Text style={styles.indicationTitle}>{title}</Text>
      <Text style={styles.indicationDescription}>{description}</Text>
    </View>
  </View>
);

const analysisData = {
  medication: {
    name: 'Warfarin',
    dosage: '5mg Tablet',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCpwj4XKLeHyHVchJlKQetj6ImjkChL4qpwHvzFIU_emANKyn2_UmARJEAO-_0v1eXQyUGFRiit5y7dT4KwREp18v5y46Bvy3mU3Face3Kdno-LD4t2oE_qe0FPU81B2JhWppbuLbcX738jyCuSei7RzHGEwjUU9dGurHEM_QggaGGEn24SJ9MQe9v5ccVmlTntizrimVE6r944k5eM-kkIC0eEBuMkSCncFu8LuUaFLKbBffXdP-XnO5WwXNxJqiO7xR0L3e7e6NQ',
  },
  warning: {
    title: 'Risk Detected',
    subtitle: 'High risk of interaction',
    aiSummary:
      'This medication has been flagged due to a major interaction with your current medication profile. Combining these may significantly increase your risk of internal bleeding.',
    tags: ['Major Interaction', 'Bleeding Risk'],
  },
  counterIndications: [
    {
      icon: 'medication',
      title: 'NSAIDs (e.g. Ibuprofen)',
      description: 'Increases risk of gastrointestinal bleeding significantly.',
    },
    {
      icon: 'restaurant',
      title: 'Leafy Green Vegetables',
      description: 'Vitamin K can interfere with drug effectiveness.',
    },
    {
      icon: 'no-drinks',
      title: 'Alcohol Consumption',
      description: 'May alter the metabolism of this anticoagulant.',
    },
  ],
};

export default function AnalysisResultScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Result</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="warning" size={80} color={theme.danger} />
          </View>
          <Text style={styles.heroTitle}>{analysisData.warning.title}</Text>
          <Text style={styles.heroSubtitle}>{analysisData.warning.subtitle}</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Image
              source={{
                uri: analysisData.medication.image,
              }}
              style={styles.medicationImage}
            />
            <View style={styles.cardContent}>
              <View style={styles.tagHighRisk}>
                <Text style={styles.tagHighRiskText}>High Risk</Text>
              </View>
              <Text style={styles.medicationName}>{analysisData.medication.name}</Text>
              <Text style={styles.medicationDosage}>{analysisData.medication.dosage}</Text>
            </View>
            <TouchableOpacity style={styles.infoButton}>
              <MaterialIcons name="info" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <MaterialIcons name="report-problem" size={22} color={theme.danger} /> AI Warning
          </Text>
          <View style={styles.aiWarningCard}>
            <Text style={styles.aiWarningText}>{analysisData.warning.aiSummary}</Text>
            <View style={styles.tagsContainer}>
              {analysisData.warning.tags.map((tag) => (
                <View
                  key={tag}
                  style={
                    tag === 'Major Interaction'
                      ? styles.tagMajorInteraction
                      : styles.tagBleedingRisk
                  }>
                  <Text
                    style={
                      tag === 'Major Interaction'
                        ? styles.tagMajorInteractionText
                        : styles.tagBleedingRiskText
                    }>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <MaterialIcons name="block" size={22} color={theme.primary} /> Counter-indications
          </Text>
          <View style={styles.indicationsContainer}>
            {analysisData.counterIndications.map((item) => (
              <CounterIndicationItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                color={theme.danger}
              />
            ))}
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Emergency Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This is a critical alert. Do not consume this medication if you are unsure. Contact your
            physician immediately for medical advice.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.scanButton}>
          <MaterialIcons name="qr-code-scanner" size={20} color={theme.text} />
          <Text style={styles.scanButtonText}>Scan Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailsButton}>
          <MaterialIcons name="visibility" size={20} color={'white'} />
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111818',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Increased padding to avoid content being hidden by the footer
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 999,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: '#111818',
  },
  heroSubtitle: {
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cardContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  medicationImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  cardContent: {
    flex: 1,
  },
  tagHighRisk: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  tagHighRiskText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  medicationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111818',
  },
  medicationDosage: {
    fontSize: 14,
    color: '#618989',
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 189, 189, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    color: '#111818',
  },
  aiWarningCard: {
    backgroundColor: 'rgba(254, 226, 226, 0.5)',
    borderRadius: 16,
    padding: 20,
  },
  aiWarningText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111818',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  tagMajorInteraction: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagMajorInteractionText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tagBleedingRisk: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagBleedingRiskText: {
    color: '#C2410C',
    fontSize: 12,
    fontWeight: 'bold',
  },
  indicationsContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  indicationItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  indicationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicationTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#111818',
  },
  indicationDescription: {
    fontSize: 12,
    color: '#618989',
    marginTop: 2,
  },
  disclaimer: {
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  disclaimerTitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 4,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'transparent',
  },
  scanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  scanButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111818',
  },
  detailsButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#0fbdbd',
    shadowColor: '#0fbdbd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  detailsButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});
