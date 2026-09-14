import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MovementCard } from '../../../../shared/components/MovementCard';
import {
  emitBridgeEvent,
  subscribeToBridgeEvents,
} from '../../../../shared/bridge/bridge';
import {
  colors,
  radius,
  spacing,
  typography,
  validationText,
} from '../../../../shared/theme/theme';
import { useHome } from '../hooks/useHome';

export function HomeScreen() {
  const { user, movements, error } = useHome();
  const [sessionExpired, setSessionExpired] = useState(false);
  useEffect(() => {
    let expirationTimer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = subscribeToBridgeEvents(event => {
      if (event.type === 'SESSION_EXPIRED') {
        setSessionExpired(true);
        expirationTimer = setTimeout(
          () => emitBridgeEvent({ type: 'LOGOUT' }),
          1500,
        );
      }
    });
    return () => {
      unsubscribe();
      if (expirationTimer) clearTimeout(expirationTimer);
    };
  }, []);
  if (!user)
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
        {sessionExpired ? (
          <Text style={validationText}>Tu sesión expiró, ingresa de nuevo</Text>
        ) : error ? (
          <Text style={validationText}>{error}</Text>
        ) : (
          <Text style={styles.muted}>Cargando tu información...</Text>
        )}
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {sessionExpired ? (
          <Text style={validationText}>Tu sesión expiró, ingresa de nuevo</Text>
        ) : null}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, {user.name}</Text>
            <Text style={styles.muted}>Este es el resumen de tu cuenta</Text>
          </View>
          <Pressable
            accessibilityLabel="Cerrar sesión"
            onPress={() => emitBridgeEvent({ type: 'LOGOUT' })}
          >
            <Text style={styles.logout}>Salir</Text>
          </Pressable>
        </View>
        <View style={styles.balance}>
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <Text style={styles.balanceValue}>
            ${user.balance.toLocaleString('es-CO')}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            style={[styles.action, styles.transfer]}
            onPress={() => emitBridgeEvent({ type: 'OPEN_TRANSFER' })}
          >
            <Text style={styles.actionIcon}>↗</Text>
            <Text style={styles.actionText}>Transferir</Text>
          </Pressable>
          <Pressable
            style={[styles.action, styles.movements]}
            onPress={() => emitBridgeEvent({ type: 'OPEN_MOVEMENTS' })}
          >
            <Text style={styles.actionIcon}>≡</Text>
            <Text style={styles.actionText}>Movimientos</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionTitle}>Recientes</Text>
        {movements.map(movement => (
          <MovementCard key={movement.id} movement={movement} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  container: { padding: spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '600',
  },
  muted: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  logout: { color: colors.primary, fontWeight: '700' },
  balance: {
    backgroundColor: colors.textPrimary,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    color: colors.white,
    opacity: 0.75,
    fontSize: typography.caption,
  },
  balanceValue: {
    color: colors.white,
    fontSize: typography.amount,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  actions: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  action: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 104,
  },
  transfer: { backgroundColor: colors.primary },
  movements: { backgroundColor: colors.secondary },
  actionIcon: { fontSize: 26, color: colors.textPrimary },
  actionText: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
});
