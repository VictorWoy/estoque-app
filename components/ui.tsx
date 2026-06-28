import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
  ViewStyle, TextStyle,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';

// ─── Button ──────────────────────────────────────────────────────────────────

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'outline' | 'ghost';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label, onPress, variant = 'primary', icon, loading, disabled, style, fullWidth,
}: ButtonProps) {
  const styles = buttonVariants[variant];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        btnBase.btn,
        styles.btn,
        fullWidth && { alignSelf: 'stretch' },
        (disabled || loading) && btnBase.disabled,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator size="small" color={styles.text.color as string} />
        : <>
            {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
            <Text style={[btnBase.label, styles.text]}>{label}</Text>
          </>
      }
    </TouchableOpacity>
  );
}

const btnBase = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderRadius: Radius.md, minHeight: 44,
  },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.medium },
  disabled: { opacity: 0.5 },
});

const buttonVariants = {
  primary: StyleSheet.create({
    btn: { backgroundColor: Colors.primary },
    text: { color: Colors.white },
  }),
  success: StyleSheet.create({
    btn: { backgroundColor: Colors.success },
    text: { color: Colors.white },
  }),
  danger: StyleSheet.create({
    btn: { backgroundColor: Colors.danger },
    text: { color: Colors.white },
  }),
  outline: StyleSheet.create({
    btn: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
    text: { color: Colors.text },
  }),
  ghost: StyleSheet.create({
    btn: { backgroundColor: Colors.gray100 },
    text: { color: Colors.gray700 },
  }),
};

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ children, style, onPress }: CardProps) {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[cardStyles.card, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[cardStyles.card, style]}>{children}</View>;
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
});

// ─── Badge ───────────────────────────────────────────────────────────────────

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
  style?: ViewStyle;
}

const badgeColors: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  success: { bg: Colors.successLight, text: Colors.success, border: Colors.successBorder },
  warning: { bg: Colors.warningLight, text: Colors.warning, border: Colors.warningBorder },
  danger:  { bg: Colors.dangerLight,  text: Colors.danger,  border: Colors.dangerBorder  },
  info:    { bg: Colors.primaryLight, text: Colors.primary, border: Colors.primaryBorder },
  neutral: { bg: Colors.gray100,      text: Colors.gray600, border: Colors.gray200       },
};

export function Badge({ label, variant, style }: BadgeProps) {
  const c = badgeColors[variant];
  return (
    <View style={[{ backgroundColor: c.bg, borderWidth: 1, borderColor: c.border,
      paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full,
      alignSelf: 'flex-start' }, style]}>
      <Text style={{ color: c.text, fontSize: FontSize.xs, fontWeight: FontWeight.semibold }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[{ height: 1, backgroundColor: Colors.border }, style]} />;
}

// ─── SectionHeader ───────────────────────────────────────────────────────────

export function SectionHeader({ title, style }: { title: string; style?: TextStyle }) {
  return (
    <Text style={[{
      fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
      color: Colors.textMuted, textTransform: 'uppercase',
      letterSpacing: 0.8, marginBottom: Spacing.sm, marginTop: Spacing.sm,
    }, style]}>
      {title}
    </Text>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <View style={emptyStyles.container}>
      <View style={emptyStyles.iconWrap}>{icon}</View>
      <Text style={emptyStyles.title}>{title}</Text>
      {subtitle && <Text style={emptyStyles.subtitle}>{subtitle}</Text>}
      {action && (
        <Button label={action.label} onPress={action.onPress} style={{ marginTop: Spacing.lg }} />
      )}
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: Spacing.xxl },
  iconWrap: { marginBottom: Spacing.lg, opacity: 0.4 },
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
});

// ─── StatCard ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  style?: ViewStyle;
}

export function StatCard({ label, value, color, style }: StatCardProps) {
  return (
    <View style={[statStyles.card, style]}>
      <Text style={statStyles.label}>{label}</Text>
      <Text style={[statStyles.value, color && { color }]}>{value}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: Colors.gray50,
    borderRadius: Radius.md, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  label: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 4 },
  value: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.text },
});

// ─── ProgressBar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  style?: ViewStyle;
}

export function ProgressBar({ value, color = Colors.primary, style }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <View style={[{ height: 5, backgroundColor: Colors.gray200, borderRadius: 4, overflow: 'hidden' }, style]}>
      <View style={{ width: `${clamped}%`, height: '100%', backgroundColor: color, borderRadius: 4 }} />
    </View>
  );
}
