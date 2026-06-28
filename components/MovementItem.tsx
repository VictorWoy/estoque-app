import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Movement } from '../types';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../constants/theme';

interface MovementItemProps {
  movement: Movement;
  showProduct?: boolean;
}

export function MovementItem({ movement, showProduct = true }: MovementItemProps) {
  const isIn = movement.type === 'in';
  const color = isIn ? Colors.success : Colors.danger;
  const bgColor = isIn ? Colors.successLight : Colors.dangerLight;
  const icon = isIn ? 'arrow-down-circle' : 'arrow-up-circle';

  const date = new Date(movement.createdAt);
  const dateStr = format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: bgColor }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.info}>
        {showProduct && (
          <Text style={styles.productName} numberOfLines={1}>{movement.productName}</Text>
        )}
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.balance}>Saldo após: {movement.balanceAfter} un.</Text>
      </View>
      <View style={styles.qtyWrap}>
        <Text style={[styles.qty, { color }]}>
          {isIn ? '+' : '–'}{movement.quantity}
        </Text>
        <Text style={styles.qtyUnit}>un.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: Radius.full,
    alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md, flexShrink: 0,
  },
  info: { flex: 1, marginRight: Spacing.md },
  productName: {
    fontSize: FontSize.md, fontWeight: FontWeight.medium,
    color: Colors.text, marginBottom: 2,
  },
  date: { fontSize: FontSize.xs, color: Colors.textMuted },
  balance: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  qtyWrap: { alignItems: 'flex-end' },
  qty: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  qtyUnit: { fontSize: FontSize.xs, color: Colors.textMuted },
});
