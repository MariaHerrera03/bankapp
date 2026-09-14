import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
} from '../../../../shared/theme/theme';
import { useMovements } from '../hooks/useMovements';

function dateLabel(date: string) {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  return days === 0 ? 'HOY' : days === 1 ? 'AYER' : `${days} DÍAS ATRÁS`;
}
export function MovementsScreen() {
  const list = useMovements();
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
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          onPress={() => emitBridgeEvent({ type: 'OPEN_HOME' } as any)}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Actividad</Text>
      </View>
      {sessionExpired ? (
        <Text style={styles.sessionExpired}>
          Tu sesión expiró, ingresa de nuevo
        </Text>
      ) : null}
      <TextInput
        value={list.query}
        onChangeText={list.setQuery}
        placeholder="Buscar movimiento"
        placeholderTextColor={colors.textSecondary}
        style={styles.search}
      />
      <FlatList
        data={list.items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item, index }) => (
          <View>
            {(index === 0 ||
              dateLabel(item.date) !==
                dateLabel(list.items[index - 1].date)) && (
              <Text style={styles.dateLabel}>{dateLabel(item.date)}</Text>
            )}
            <MovementCard movement={item} />
          </View>
        )}
        onEndReached={list.loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          list.loading ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.muted}>Cargando más movimientos...</Text>
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          !list.loading ? (
            <Text style={styles.muted}>No encontramos movimientos.</Text>
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  back: { color: colors.primary, fontSize: 36, marginRight: spacing.md },
  title: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '600',
  },
  sessionExpired: {
    color: colors.error,
    fontSize: typography.caption,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xs,
  },
  search: {
    height: 48,
    margin: spacing.xl,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
  },
  content: { paddingHorizontal: spacing.xl },
  dateLabel: {
    color: colors.textSecondary,
    fontSize: typography.label,
    fontWeight: '500',
    marginTop: spacing.md,
  },
  footer: { alignItems: 'center', paddingVertical: spacing.lg },
  muted: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: spacing.sm,
  },
});
