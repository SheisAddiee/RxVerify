import * as FileSystem from 'expo-file-system';
import { Medication } from './verification';

const HISTORY_FILE = FileSystem.documentDirectory + 'history.json';

export interface HistoryItem extends Medication {
  timestamp: number;
}

export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const info = await FileSystem.getInfoAsync(HISTORY_FILE);
    if (!info.exists) {
      return [];
    }
    const content = await FileSystem.readAsStringAsync(HISTORY_FILE);
    return JSON.parse(content);
  } catch (e) {
    console.error("Error reading history:", e);
    return [];
  }
}

export async function addToHistory(med: Medication): Promise<void> {
  try {
    const history = await getHistory();
    const newItem: HistoryItem = { ...med, timestamp: Date.now() };
    // Prepend
    const newHistory = [newItem, ...history];
    await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify(newHistory));
  } catch (e) {
    console.error("Error writing history:", e);
  }
}

export async function clearHistory(): Promise<void> {
    try {
        await FileSystem.deleteAsync(HISTORY_FILE, { idempotent: true });
    } catch (e) {
        console.error("Error clearing history:", e);
    }
}
