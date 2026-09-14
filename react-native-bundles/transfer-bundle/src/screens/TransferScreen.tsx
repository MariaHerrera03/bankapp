import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  emitBridgeEvent,
  subscribeToBridgeEvents,
} from '../../../../shared/bridge/bridge';
import { DEV_USER } from '../../../../shared/theme/devData';
import {
  colors,
  componentSizes,
  radius,
  spacing,
  typography,
  validationText,
} from '../../../../shared/theme/theme';
import { useTransfer } from '../hooks/useTransfer';

export function TransferScreen() {
  const [sessionExpired, setSessionExpired] = useState(false);
  const transfer = useTransfer(DEV_USER.phone, result =>
    emitBridgeEvent({ type: 'TRANSFER_SUCCESS', payload: result }),
  );
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
  const handleAmountChange = (value: string) => {
    const digits = value.replace(/\D/g, '');
    transfer.setAmountText(
      digits ? Number(digits).toLocaleString('es-CO') : '',
    );
  };
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => emitBridgeEvent({ type: 'OPEN_HOME' } as any)}
          >
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Nueva transferencia</Text>
        </View>
        {sessionExpired ? (
          <Text style={validationText}>Tu sesión expiró, ingresa de nuevo</Text>
        ) : null}
        <Text style={styles.label}>TELÉFONO DESTINO</Text>
        <TextInput
          value={transfer.destinationPhone}
          onChangeText={transfer.setDestinationPhone}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder={DEV_USER.phone}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
        {transfer.errors.phone ? (
          <Text style={validationText}>{transfer.errors.phone}</Text>
        ) : null}
        <Text style={styles.label}>MONTO</Text>
        <View style={styles.amountInput}>
          <Text style={styles.currency}>$</Text>
          <TextInput
            value={transfer.amountText}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textSecondary}
            style={styles.amountText}
          />
        </View>
        {transfer.errors.amount ? (
          <Text style={validationText}>{transfer.errors.amount}</Text>
        ) : null}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <View style={styles.row}>
            <Text style={styles.muted}>Monto</Text>
            <Text style={styles.value}>
              ${(transfer.amount || 0).toLocaleString('es-CO')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.muted}>Costo de servicio</Text>
            <Text style={styles.value}>Gratis</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total a pagar</Text>
            <Text style={styles.total}>
              ${(transfer.amount || 0).toLocaleString('es-CO')}
            </Text>
          </View>
        </View>
        {transfer.error ? (
          <Text style={validationText}>{transfer.error}</Text>
        ) : null}
        <Pressable
          disabled={!transfer.canSubmit || transfer.loading}
          onPress={() => transfer.setShowConfirmation(true)}
          style={[
            styles.button,
            (!transfer.canSubmit || transfer.loading) && styles.disabled,
          ]}
        >
          {transfer.loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Enviar dinero</Text>
          )}
        </Pressable>
        <Modal
          transparent
          visible={transfer.showConfirmation}
          animationType="fade"
        >
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Confirmar transferencia</Text>
              <Text style={styles.modalBody}>
                Estás enviando ${transfer.amount.toLocaleString('es-CO')} a{' '}
                {transfer.destinationPhone}. Esta acción no se puede deshacer.
              </Text>
              <Pressable onPress={transfer.confirm} style={styles.button}>
                <Text style={styles.buttonText}>Confirmar y enviar</Text>
              </Pressable>
              <Pressable
                onPress={() => transfer.setShowConfirmation(false)}
                style={styles.cancel}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  back: { color: colors.primary, fontSize: 36, marginRight: spacing.md },
  title: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '600',
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.label,
    fontWeight: '500',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    height: componentSizes.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    fontSize: typography.body,
  },
  amountInput: {
    height: componentSizes.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  currency: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  amountText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
    paddingLeft: spacing.sm,
  },
  summary: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: typography.body,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  muted: { color: colors.textSecondary, fontSize: typography.caption },
  value: { color: colors.textPrimary, fontSize: typography.caption },
  totalLabel: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  total: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  button: {
    height: componentSizes.buttonHeight,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  disabled: { opacity: 0.45 },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.body,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.overlay,
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  modalTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  modalBody: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
    marginTop: spacing.md,
  },
  cancel: { alignItems: 'center', padding: spacing.md, marginTop: spacing.sm },
  cancelText: { color: colors.primary, fontWeight: '700' },
});
