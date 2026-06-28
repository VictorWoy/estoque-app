import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, Movement } from '../types';

const KEYS = {
  PRODUCTS: '@estoque:products',
  MOVEMENTS: '@estoque:movements',
};

export const StorageService = {
  async getProducts(): Promise<Product[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.PRODUCTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async saveProducts(products: Product[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  async getMovements(): Promise<Movement[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.MOVEMENTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async saveMovements(movements: Movement[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.MOVEMENTS, JSON.stringify(movements));
  },

  async addMovement(movement: Movement): Promise<void> {
    const all = await StorageService.getMovements();
    all.unshift(movement);
    // Keep last 500 movements
    const trimmed = all.slice(0, 500);
    await StorageService.saveMovements(trimmed);
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([KEYS.PRODUCTS, KEYS.MOVEMENTS]);
  },
};
