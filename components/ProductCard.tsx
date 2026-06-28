import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Product } from '../types';
import { Badge, Card, ProgressBar } from './ui';
import { Colors, FontSize, FontWeight, Spacing } from '../constants/theme';

interface ProductCardProps {
  product: Product;
  onIn: () => void;
  onOut: () => void;
}

function getStockStatus(product: Product): {
  label: string;
  variant: 'success' | 'warning' | 'danger';
  pct: number;
  barColor: string;
} {
  if (product.minStock === null) {
    return { label: 'Sem mínimo', variant: 'neutral' as any, pct: 100, barColor: Colors.gray300 };
  }
  const pct = product.minStock > 0
    ? Math.round((product.quantity / product.minStock) * 100)
    : 100;

  if (product.quantity === 0) {
    return { label: 'Esgotado', variant: 'danger', pct: 0, barColor: Colors.danger };
  }
  if (product.quantity <= product.minStock) {
    return { label: 'Estoque baixo', variant: 'warning', pct, barColor: Colors.warning };
  }
  return { label: 'Regular', variant: 'success', pct: Math.min(pct, 100), barColor: Colors.success };
}

export function ProductCard({ product, onIn, onOut }: ProductCardProps) {
  const status = getStockStatus(product);

  return (
    <Card>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push(`/product/${product.id}`)}
      >
        <View style={styles.header}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
            {product.minStock !== null && (
              <Text style={styles.minLabel}>Mín. {product.minStock} un.</Text>
            )}
          </View>
          <Badge label={status.label} variant={status.variant} />
        </View>

        <View style={styles.qtyRow}>
          <Text style={styles.qty}>{product.quantity}</Text>
          <Text style={styles.qtyUnit}>unidades</Text>
        </View>

        {product.minStock !== null && (
          <ProgressBar
            value={status.pct}
            color={status.barColor}
            style={{ marginTop: Spacing.md, marginBottom: Spacing.sm }}
          />
        )}
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.inBtn]} onPress={onIn} activeOpacity={0.75}>
          <Ionicons name="add-circle-outline" size={16} color={Colors.success} />
          <Text style={[styles.actionLabel, { color: Colors.success }]}>Entrada</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={[styles.actionBtn, styles.outBtn]} onPress={onOut} activeOpacity={0.75}>
          <Ionicons name="remove-circle-outline" size={16} color={Colors.danger} />
          <Text style={[styles.actionLabel, { color: Colors.danger }]}>Saída</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm },
  name: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  minLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  qty: { fontSize: 34, fontWeight: FontWeight.bold, color: Colors.text, lineHeight: 40 },
  qtyUnit: { fontSize: FontSize.sm, color: Colors.textSecondary },
  actions: {
    flexDirection: 'row', marginTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.md,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 5, paddingVertical: 8,
    borderRadius: 8,
  },
  inBtn: { backgroundColor: Colors.successLight },
  outBtn: { backgroundColor: Colors.dangerLight },
  actionDivider: { width: 8 },
  actionLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
});
