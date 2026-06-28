import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Product } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) return false;

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('stock-alerts', {
        name: 'Alertas de Estoque',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#DC2626',
      });
    }

    return finalStatus === 'granted';
  },

  async sendLowStockAlert(product: Product): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚠️ Estoque Baixo',
          body: `"${product.name}" atingiu o mínimo. Saldo atual: ${product.quantity} un. (mín. ${product.minStock})`,
          data: { productId: product.id },
          sound: true,
          ...(Platform.OS === 'android' && { channelId: 'stock-alerts' }),
        },
        trigger: null, // immediate
      });
    } catch {
      // Notification permission not granted — silent fail
    }
  },

  async checkAndNotify(product: Product): Promise<void> {
    if (product.minStock !== null && product.quantity <= product.minStock) {
      await NotificationService.sendLowStockAlert(product);
    }
  },
};
