import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert,
  TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useStock } from '../../context/StockContext';
import { MovementModal } from '../../components/MovementModal';
import { MovementItem } from '../../components/MovementItem';
import { Badge, Card, Button, Divider, SectionHeader } from '../../components/ui';
import { MovementType } from '../../types';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../../constants/theme';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, movements, registerMovement, updateProduct, deleteProduct } = useStock();
  const product = products.find(p => p.id === id);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<MovementType>('in');
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMin, setEditMin] = useState('');
  const [saving, setSaving] = useState(false);

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Colors.textMuted }}>Produto não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const productMovements = movements.filter(m => m.productId === product.id);
  const isLow = product.minStock !== null && product.quantity <= product.minStock;
  const isEmpty = product.quantity === 0;

  function openEdit() {
    setEditName(product!.name);
    setEditMin(product!.minStock?.toString() ?? '');
    setEditOpen(true);
  }

  async function handleSaveEdit() {
    if (!editName.trim()) { Alert.alert('Nome obrigatório'); return; }
    const min = editMin.trim() ? parseInt(editMin, 10) : null;
    setSaving(true);
    await updateProduct(product!.id, editName.trim(), product!.quantity, min);
    setSaving(false);
    setEditOpen(false);
  }

  function handleDelete() {
    Alert.alert(
      'Excluir produto',
      `Tem certeza que deseja excluir "${product!.name}"? O histórico de movimentações será mantido.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: async () => {
          await deleteProduct(product!.id);
          router.back();
        }},
      ]
    );
  }

  async function handleMovement(type: MovementType, qty: number) {
    const result = await registerMovement(product!.id, type, qty);
    if (!result.success) {
      Alert.alert('Erro', result.error);
    } else {
      setModalOpen(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: product.name,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={openEdit} style={styles.headerBtn}>
                <Ionicons name="create-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.headerBtn}>
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Stock overview */}
          <Card>
            <View style={styles.overviewRow}>
              <View>
                <Text style={styles.qtyLabel}>Saldo atual</Text>
                <Text style={[styles.qty, isEmpty && { color: Colors.danger }, isLow && !isEmpty && { color: Colors.warning }]}>
                  {product.quantity}
                </Text>
                <Text style={styles.qtyUnit}>unidades</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                {isEmpty
                  ? <Badge label="Esgotado" variant="danger" />
                  : isLow
                  ? <Badge label="Estoque baixo" variant="warning" />
                  : <Badge label="Regular" variant="success" />
                }
                {product.minStock !== null && (
                  <Text style={styles.minInfo}>Mín. {product.minStock} un.</Text>
                )}
              </View>
            </View>

            <Text style={styles.createdAt}>
              Cadastrado em {format(new Date(product.createdAt), "dd/MM/yyyy", { locale: ptBR })}
            </Text>
          </Card>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <Button
              label="Entrada"
              variant="success"
              style={{ flex: 1 }}
              icon={<Ionicons name="add-circle-outline" size={18} color={Colors.white} />}
              onPress={() => { setModalType('in'); setModalOpen(true); }}
            />
            <View style={{ width: Spacing.sm }} />
            <Button
              label="Saída"
              variant="danger"
              style={{ flex: 1 }}
              icon={<Ionicons name="remove-circle-outline" size={18} color={Colors.white} />}
              onPress={() => { setModalType('out'); setModalOpen(true); }}
            />
          </View>

          {/* Movement history */}
          <SectionHeader title={`Histórico (${productMovements.length})`} />
          {productMovements.length === 0 ? (
            <View style={styles.emptyHist}>
              <Ionicons name="time-outline" size={28} color={Colors.textMuted} />
              <Text style={styles.emptyHistText}>Sem movimentações registradas</Text>
            </View>
          ) : (
            <Card style={{ padding: 0, paddingHorizontal: Spacing.lg }}>
              {productMovements.map((m, i) => (
                <React.Fragment key={m.id}>
                  <MovementItem movement={m} showProduct={false} />
                  {i < productMovements.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Movement modal */}
      <MovementModal
        visible={modalOpen}
        product={product}
        initialType={modalType}
        onClose={() => setModalOpen(false)}
        onConfirm={handleMovement}
      />

      {/* Edit modal */}
      <Modal visible={editOpen} transparent animationType="slide" onRequestClose={() => setEditOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setEditOpen(false)} activeOpacity={1} />
          <View style={styles.editSheet}>
            <View style={styles.handle} />
            <Text style={styles.editTitle}>Editar produto</Text>
            <Text style={styles.editLabel}>Nome</Text>
            <TextInput style={styles.editInput} value={editName} onChangeText={setEditName} autoCapitalize="words" />
            <Text style={styles.editLabel}>Estoque mínimo (opcional)</Text>
            <TextInput style={styles.editInput} value={editMin} onChangeText={setEditMin} keyboardType="number-pad" placeholder="—" placeholderTextColor={Colors.textMuted} />
            <Button label="Salvar alterações" onPress={handleSaveEdit} loading={saving} fullWidth style={{ marginTop: Spacing.lg }} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  headerBtn: { padding: 6 },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  qtyLabel: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 2 },
  qty: { fontSize: 52, fontWeight: FontWeight.bold, color: Colors.text, lineHeight: 58 },
  qtyUnit: { fontSize: FontSize.sm, color: Colors.textSecondary },
  minInfo: { fontSize: FontSize.xs, color: Colors.textMuted },
  createdAt: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.md },
  actionRow: { flexDirection: 'row', marginBottom: Spacing.lg },
  emptyHist: { alignItems: 'center', gap: 8, paddingVertical: Spacing.xxl },
  emptyHistText: { fontSize: FontSize.sm, color: Colors.textMuted },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,.45)' },
  editSheet: {
    backgroundColor: Colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: Spacing.xl, paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl,
  },
  handle: { width: 36, height: 4, backgroundColor: Colors.gray300, borderRadius: 4, alignSelf: 'center', marginBottom: Spacing.lg },
  editTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.lg },
  editLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  editInput: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSize.md, color: Colors.text, backgroundColor: Colors.white,
  },
});
