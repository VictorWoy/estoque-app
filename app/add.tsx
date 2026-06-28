import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  Alert, KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useStock } from '../context/StockContext';
import { Button, Card } from '../components/ui';
import { Colors, Spacing, FontSize, FontWeight, Radius } from '../constants/theme';

export default function AddProductScreen() {
  const { addProduct } = useStock();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [minStock, setMinStock] = useState('');
  const [loading, setLoading] = useState(false);

  const qtyRef = useRef<TextInput>(null);
  const minRef = useRef<TextInput>(null);

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do produto.');
      return;
    }
    const qty = parseInt(quantity, 10) || 0;
    const min = minStock.trim() ? parseInt(minStock, 10) : null;

    if (qty < 0) {
      Alert.alert('Valor inválido', 'A quantidade não pode ser negativa.');
      return;
    }
    if (min !== null && min < 0) {
      Alert.alert('Valor inválido', 'O estoque mínimo não pode ser negativo.');
      return;
    }

    setLoading(true);
    await addProduct(name.trim(), qty, min);
    setLoading(false);

    setName('');
    setQuantity('');
    setMinStock('');

    Alert.alert(
      'Produto cadastrado',
      `"${name.trim()}" foi adicionado ao estoque.`,
      [{ text: 'Ver produtos', onPress: () => router.push('/'), style: 'default' },
       { text: 'Cadastrar outro', style: 'cancel' }]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              Preencha as informações do produto. O estoque mínimo é opcional — quando definido,
              o app emite alertas quando o saldo atingir esse limite.
            </Text>
          </View>

          <Card>
            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Nome do produto <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Café 500g, Parafuso M6..."
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => qtyRef.current?.focus()}
              />
            </View>

            {/* Quantity */}
            <View style={styles.field}>
              <Text style={styles.label}>Quantidade atual</Text>
              <TextInput
                ref={qtyRef}
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                returnKeyType="next"
                onSubmitEditing={() => minRef.current?.focus()}
              />
              <Text style={styles.hint}>Deixe 0 caso o produto ainda não tenha estoque.</Text>
            </View>

            {/* Min stock */}
            <View style={[styles.field, { marginBottom: 0 }]}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Estoque mínimo</Text>
                <Text style={styles.optional}>opcional</Text>
              </View>
              <TextInput
                ref={minRef}
                style={styles.input}
                value={minStock}
                onChangeText={setMinStock}
                placeholder="Ex: 10"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <Text style={styles.hint}>
                Quando o saldo chegar a esse número, você receberá um alerta.
              </Text>
            </View>
          </Card>

          <Button
            label="Cadastrar produto"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            icon={<Ionicons name="add-circle-outline" size={18} color={Colors.white} />}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  infoCard: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.primaryLight, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.primaryBorder,
    padding: Spacing.md, marginBottom: Spacing.lg,
  },
  infoText: { flex: 1, fontSize: FontSize.sm, color: Colors.primaryDark, lineHeight: 20 },
  field: { marginBottom: Spacing.lg },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary, marginBottom: Spacing.sm },
  required: { color: Colors.danger },
  optional: {
    fontSize: FontSize.xs, color: Colors.textMuted,
    backgroundColor: Colors.gray100, paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: Radius.full,
  },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: FontSize.md, color: Colors.text, backgroundColor: Colors.white,
  },
  hint: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 6, lineHeight: 18 },
});
