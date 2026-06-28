import React, { useState, useMemo } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStock } from '../context/StockContext';
import { MovementItem } from '../components/MovementItem';
import { EmptyState, Divider } from '../components/ui';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../constants/theme';

type FilterType = 'all' | 'in' | 'out';

export default function HistoryScreen() {
  const { movements } = useStock();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return movements;
    return movements.filter(m => m.type === filter);
  }, [movements, filter]);

  const totalIn = movements.filter(m => m.type === 'in').reduce((acc, m) => acc + m.quantity, 0);
  const totalOut = movements.filter(m => m.type === 'out').reduce((acc, m) => acc + m.quantity, 0);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Summary strip */}
      <View style={styles.strip}>
        <View style={styles.stripItem}>
          <Text style={styles.stripLabel}>Total entradas</Text>
          <Text style={[styles.stripValue, { color: Colors.success }]}>+{totalIn}</Text>
        </View>
        <View style={styles.stripDivider} />
        <View style={styles.stripItem}>
          <Text style={styles.stripLabel}>Total saídas</Text>
          <Text style={[styles.stripValue, { color: Colors.danger }]}>–{totalOut}</Text>
        </View>
        <View style={styles.stripDivider} />
        <View style={styles.stripItem}>
          <Text style={styles.stripLabel}>Movimentações</Text>
          <Text style={styles.stripValue}>{movements.length}</Text>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {(['all', 'in', 'out'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterLabel, filter === f && styles.filterLabelActive]}>
              {f === 'all' ? 'Tudo' : f === 'in' ? 'Entradas' : 'Saídas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={
          <EmptyState
            icon={<Ionicons name="time-outline" size={52} color={Colors.gray400} />}
            title="Sem movimentações"
            subtitle="As entradas e saídas de estoque aparecem aqui."
          />
        }
        renderItem={({ item }) => <MovementItem movement={item} showProduct />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  strip: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingVertical: Spacing.md,
  },
  stripItem: { flex: 1, alignItems: 'center' },
  stripLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 2 },
  stripValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  stripDivider: { width: 1, backgroundColor: Colors.border },
  filterRow: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: Spacing.sm,
  },
  filterBtn: {
    paddingHorizontal: Spacing.lg, paddingVertical: 6,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.gray50,
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  filterLabelActive: { color: Colors.white },
  list: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
});
