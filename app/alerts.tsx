import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStock } from '../context/StockContext';
import { MovementModal } from '../components/MovementModal';
import { EmptyState, Card, Badge, Button } from '../components/ui';
import { Product, MovementType } from '../types';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../constants/theme';

export default function AlertsScreen() {
  const { lowStockProducts, registerMovement } = useStock();
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  async function handleMovement(type: MovementType, quantity: number) {
    if (!modalProduct) return;
    const result = await registerMovement(modalProduct.id, type, quantity);
    if (!result.success) {
      Alert.alert('Erro', result.error ?? 'Não foi possível registrar.');
    } else {
      setModalProduct(null);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {lowStockProducts.length > 0 && (
        <View style={styles.banner}>
          <Ionicons name="warning-outline" size={18} color={Colors.warning} />
          <Text style={styles.bannerText}>
            {lowStockProducts.length} produto{lowStockProducts.length > 1 ? 's' : ''} com estoque baixo ou esgotado
          </Text>
        </View>
      )}

      <FlatList
        data={lowStockProducts}
        keyExtractor={p => p.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon={<Ionicons name="checkmark-circle-outline" size={52} color={Colors.success} />}
            title="Tudo em ordem"
            subtitle="Nenhum produto está abaixo do estoque mínimo definido."
          />
        }
        renderItem={({ item }) => {
          const isEmpty = item.quantity === 0;
          const deficit = (item.minStock ?? 0) - item.quantity;

          return (
            <Card style={[styles.alertCard, isEmpty && styles.alertCardEmpty]}>
              <View style={styles.alertHeader}>
                <View style={styles.alertIconWrap}>
                  <Ionicons
                    name={isEmpty ? 'alert-circle' : 'warning'}
                    size={22}
                    color={isEmpty ? Colors.danger : Colors.warning}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertName} numberOfLines={1}>{item.name}</Text>
                  <Badge
                    label={isEmpty ? 'Esgotado' : 'Estoque baixo'}
                    variant={isEmpty ? 'danger' : 'warning'}
                    style={{ marginTop: 4 }}
                  />
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Atual</Text>
                  <Text style={[styles.statValue, { color: isEmpty ? Colors.danger : Colors.warning }]}>
                    {item.quantity}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Mínimo</Text>
                  <Text style={styles.statValue}>{item.minStock}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Faltam</Text>
                  <Text style={[styles.statValue, { color: Colors.primary }]}>{deficit}</Text>
                </View>
              </View>

              <Button
                label="Registrar entrada"
                variant="primary"
                fullWidth
                icon={<Ionicons name="add-circle-outline" size={16} color={Colors.white} />}
                onPress={() => setModalProduct(item)}
                style={{ marginTop: Spacing.md }}
              />
            </Card>
          );
        }}
      />

      <MovementModal
        visible={!!modalProduct}
        product={modalProduct}
        initialType="in"
        onClose={() => setModalProduct(null)}
        onConfirm={handleMovement}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.warningLight, borderBottomWidth: 1,
    borderBottomColor: Colors.warningBorder, padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  bannerText: { fontSize: FontSize.sm, color: Colors.warning, fontWeight: FontWeight.medium, flex: 1 },
  list: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  alertCard: { borderColor: Colors.warningBorder },
  alertCardEmpty: { borderColor: Colors.dangerBorder },
  alertHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.md },
  alertIconWrap: {
    width: 42, height: 42, borderRadius: Radius.md,
    backgroundColor: Colors.gray50, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  alertName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.gray50,
    borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 4 },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  statDivider: { width: 1, backgroundColor: Colors.border, marginHorizontal: 8 },
});
