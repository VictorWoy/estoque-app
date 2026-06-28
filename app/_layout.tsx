import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StockProvider, useStock } from '../context/StockContext';
import { Colors, FontSize } from '../constants/theme';

function TabsLayout() {
  const { lowStockProducts } = useStock();
  const alertCount = lowStockProducts.length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          backgroundColor: Colors.white,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: FontSize.lg,
          fontWeight: '600',
          color: Colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
          tabBarBadge: alertCount > 0 ? alertCount : undefined,
          tabBarBadgeStyle: { backgroundColor: Colors.danger, fontSize: 11 },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Cadastrar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Hidden screens */}
      <Tabs.Screen name="product/[id]" options={{ href: null }} />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <StockProvider>
        <TabsLayout />
      </StockProvider>
    </SafeAreaProvider>
  );
}
