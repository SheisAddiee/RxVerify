import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getHistory, clearHistory, HistoryItem } from '../../services/storage';

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const handleClear = async () => {
      await clearHistory();
      loadHistory();
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View className="bg-white p-4 rounded-lg mb-4 shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-start">
            <View>
                <Text className="font-bold text-lg text-gray-800">{item.names[0]}</Text>
                <Text className="text-gray-500 text-sm">{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
            <View className="bg-green-100 px-2 py-1 rounded">
                <Text className="text-green-800 text-xs font-bold">Safe</Text>
            </View>
        </View>
        <Text className="text-gray-600 mt-2" numberOfLines={2}>{item.description}</Text>
        <View className="mt-2 bg-blue-50 p-2 rounded">
             <Text className="text-blue-800 text-xs">Dosage: {item.dosage}</Text>
        </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="p-4 flex-row justify-between items-center bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Medicine Cabinet</Text>
        {history.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
                <Text className="text-red-500">Clear</Text>
            </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
          <View className="flex-1 justify-center items-center p-8">
              <Text className="text-gray-400 text-lg text-center">No medicines scanned yet.</Text>
              <Text className="text-gray-400 text-center mt-2">Scan a package to add it to your cabinet.</Text>
          </View>
      ) : (
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${item.timestamp}-${index}`}
            contentContainerStyle={{ padding: 16 }}
          />
      )}
    </SafeAreaView>
  );
}
