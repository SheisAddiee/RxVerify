import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

import { Text, View } from '@/components/Themed';
import { getHistory, clearHistory, HistoryItem } from '@/utils/storage';
import Colors from '@/constants/Colors';

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleClearHistory = async () => {
    await clearHistory();
    await loadHistory();
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    const isSafe = item.type === 'safe';

    return (
      <View style={[styles.card, {backgroundColor: Colors.light.background}]}>
        <View style={[styles.cardHeader, {backgroundColor: 'transparent'}]}>
          <Text style={styles.medName}>{item.name}</Text>
          <View style={[styles.badge, { backgroundColor: isSafe ? '#4cd137' : '#e84118' }]}>
            <Text style={styles.badgeText}>{isSafe ? 'SAFE' : 'RISK'}</Text>
          </View>
        </View>
        <Text style={styles.dateText}>Scanned: {date}</Text>
        <Text numberOfLines={1} style={styles.usageText}>{item.usage}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
             <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="history" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No scans yet.</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearText: {
    color: '#007aff',
    fontSize: 16,
  },
  listContent: {
    padding: 15,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  usageText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  },
});
