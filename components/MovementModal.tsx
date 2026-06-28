import React, { useState, useRef, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MovementType, Product } from '../types';
import { Button } from './ui';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../constants/theme';

interface MovementModalProps {
  visible: boolean;
  product: Product | null;
  initialType?: MovementType;
  onClose: () => void;
  onConfirm: (type: MovementType, quantity: number) => Promise<void>;
}

export function MovementModal({
  visible, product, initialType = 'in', onClose, onConfirm,
}: MovementModalProps) {
  const [type, setType] = useState<MovementType>(initialType);
  const [qtyText, setQtyText] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setType(initialType);
      setQtyText('');
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [visible, initialType]);

  async function handleConfirm() {
    const qty = parseInt(qtyText, 10);
    if (!qty || qty <= 0) {
      Alert.alert('Quantidade inválida', 'Informe um valor maior que zero.');
      return;
    }
    setLoading(true);
    await onConfirm(type, qty);
    setLoading(false);
  }

  if (!product) return null;

  const isIn = type === 'in';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Registrar movimentação</Text>
              <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Type selector */}
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeBtn, isIn && styles.typeBtnActiveIn]}
              onPress={() => setType('in')}
              activeOpacity={0.75}
            >
              <Ionicons
                name="arrow-down-circle-outline"
                size={20}
                color={isIn ? Colors.success : Colors.textMuted}
              />
              <Text style={[styles.typeBtnLabel, isIn && { color: Colors.success }]}>
                Entrada
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeBtn, !isIn && styles.typeBtnActiveOut]}
              onPress={() => setType('out')}
              activeOpacity={0.75}
            >
              <Ionicons
                name="arrow-up-circle-outline"
                size={20}
                color={!isIn ? Colors.danger : Colors.textMuted}
              />
              <Text style={[styles.typeBtnLabel, !isIn && { color: Colors.danger }]}>
                Saída
              </Text>
            </TouchableOpacity>
          </View>

          {/* Current stock info */}
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Saldo atual</Text>
            <Text style={styles.balanceValue}>{product.quantity} un.</Text>
          </View>

          {/* Quantity input */}
          <Text style={styles.inputLabel}>Quantidade</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={qtyText}
            onChangeText={setQtyText}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={Colors.textMuted}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
          />

          {/* Preview */}
          {qtyText && parseInt(qtyText) > 0 && (
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Saldo após:</Text>
              <Text style={[styles.previewValue, {
                color: isIn ? Colors.success : Colors.danger,
              }]}>
                {isIn
                  ? product.quantity + parseInt(qtyText)
                  : Math.max(0, product.quantity - parseInt(qtyText))
                } un.
              </Text>
            </View>
          )}

          <Button
            label="Confirmar"
            onPress={handleConfirm}
            variant={isIn ? 'success' : 'danger'}
            loading={loading}
            fullWidth
            style={{ marginTop: Spacing.xl }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl,
  },
  handle: {
    width: 36, height: 4, backgroundColor: Colors.gray300,
    borderRadius: 4, alignSelf: 'center', marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: Spacing.lg,
  },
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
  productName: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2, maxWidth: 260 },
  closeBtn: {
    width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.gray100, borderRadius: Radius.full,
  },
  typeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: Spacing.md, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.gray50,
  },
  typeBtnActiveIn: { backgroundColor: Colors.successLight, borderColor: Colors.successBorder },
  typeBtnActiveOut: { backgroundColor: Colors.dangerLight, borderColor: Colors.dangerBorder },
  typeBtnLabel: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textMuted },
  balanceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.gray50, borderRadius: Radius.md, padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  balanceLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  balanceValue: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  inputLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: 28, fontWeight: FontWeight.bold, color: Colors.text,
    backgroundColor: Colors.white, textAlign: 'center',
  },
  previewRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 8, marginTop: Spacing.md,
  },
  previewLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  previewValue: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
