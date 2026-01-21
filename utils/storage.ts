import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication } from '@/constants/medications';

const HISTORY_KEY = 'rxverify_history';

export interface HistoryItem extends Medication {
  timestamp: number;
}

export const saveScan = async (medication: Medication): Promise<void> => {
  try {
    const history = await getHistory();
    const newItem: HistoryItem = { ...medication, timestamp: Date.now() };
    const newHistory = [newItem, ...history];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error('Failed to save scan history', e);
  }
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load history', e);
    return [];
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
};
