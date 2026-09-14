import { useMemo, useState } from 'react';
import { sendTransfer } from '../services/transferService';
import {
  TransferRequest,
  TransferResult,
} from '../../../../shared/theme/types';
import { DEV_VALID_RECIPIENTS } from '../../../../shared/theme/devData';
import { getCurrentBalance } from '../../../../shared/state/movementsStore';

export function useTransfer(
  ownPhone: string,
  onSuccess: (result: TransferResult) => void,
) {
  const [destinationPhone, setDestinationPhone] = useState('');
  const [amountText, setAmountText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const amount = Number(amountText.replace(/[^0-9]/g, ''));
  const currentBalance = getCurrentBalance();
  const errors = useMemo(
    () => ({
      phone:
        destinationPhone && !/^3\d{9}$/.test(destinationPhone)
          ? 'Ingresa un teléfono colombiano válido.'
          : destinationPhone === ownPhone
          ? 'No puedes transferirte a tu propio número.'
          : destinationPhone && !DEV_VALID_RECIPIENTS.includes(destinationPhone)
          ? 'El destinatario no existe.'
          : '',
      amount:
        amountText && amount <= 0
          ? 'El monto debe ser mayor a $0.'
              : amount > currentBalance
          ? 'El monto supera tu saldo disponible.'
          : '',
    }),
            [amount, amountText, currentBalance, destinationPhone, ownPhone],
  );
  const canSubmit = Boolean(
    destinationPhone && amountText && !errors.phone && !errors.amount,
  );

  async function confirm() {
    setLoading(true);
    setError('');
    try {
      const request: TransferRequest = {
        originUserId: 'user-001',
        destinationPhone,
        amount,
      };
      const result = await sendTransfer(request);
      onSuccess(result);
      setDestinationPhone('');
      setAmountText('');
      setShowConfirmation(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Intenta de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  }
  return {
    destinationPhone,
    setDestinationPhone,
    amountText,
    setAmountText,
    amount,
    errors,
    canSubmit,
    showConfirmation,
    setShowConfirmation,
    loading,
    error,
    confirm,
  };
}
