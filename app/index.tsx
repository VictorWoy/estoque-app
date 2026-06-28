import React, { useState, useCallback } from 'react';
import {
  View, FlatList, Text, StyleSheet, TextInput,
  TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStock } from '../context/StockContext';
import { ProductCard } from '../components/ProductCard';
import { MovementModal } from '../components/MovementModal';
import { StatCard, EmptyState } from '../components/ui';
import { Product, MovementType } from '../types';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../constants/theme';

export default function ProductsScreen() {
  const { products, loading, reload, registerMovement, lowStockProducts } = useStock();
  const [search, setSearch] = useState('');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalType, setModalType] = useState<MovementType>('in');

  const filtered = search.trim()
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  function openModal(product: Product, type: MovementType) {
    setModalProduct(product);
    setModalType(type);
  }

  async function handleMovement(type: MovementType, quantity: number) {
    if (!modalProduct) return;
    const result = await registerMovement(modalProduct.id, type, quantity);
    if (!result.success) {
      Alert.alert('Erro', result.error ?? 'Não foi possível registrar a movimentação.');
    } else {
      setModalProduct(null);
    }
  }

  const totalQty = products.reduce((acc, p) => acc + p.quantity, 0);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={Colors.primary} />}
        ListHeaderComponent={
          !search.trim() ? (
            <View style={styles.statsRow}>
              <StatCard label="Produtos" value={products.length} style={{ flex: 1 }} />
              <View style={{ width: Spacing.sm }} />
              <StatCard label="Total em estoque" value={totalQty} style={{ flex: 1 }} />
              <View style={{ width: Spacing.sm }} />
              <StatCard
                label="Abaixo do mín."
                value={lowStockProducts.length}
                color={lowStockProducts.length > 0 ? Colors.danger : undefined}
                style={{ flex: 1 }}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Ionicons name="cube-outline" size={52} color={Colors.gray400} />}
            title={search ? 'Nenhum resultado' : 'Nenhum produto'}
            subtitle={search ? `Sem produtos com "${search}"` : 'Cadastre seu primeiro produto na aba Cadastrar.'}
          />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onIn={() => openModal(item, 'in')}
            onOut={() => openModal(item, 'out')}
          />
        )}
      />

      <MovementModal
        visible={!!modalProduct}
        product={modalProduct}
        initialType={modalType}
        onClose={() => setModalProduct(null)}
        onConfirm={handleMovement}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1, paddingVertical: Spacing.md,
    fontSize: FontSize.md, color: Colors.text,
  },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  statsRow: { flexDirection: 'row', marginBottom: Spacing.lg, marginTop: Spacing.sm },
});
