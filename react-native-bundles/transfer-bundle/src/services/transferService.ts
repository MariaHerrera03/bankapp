import {
  Movement,
  TransferRequest,
  TransferResult,
} from '../../../../shared/theme/types';
import { addMovement } from '../../../../shared/state/movementsStore';

export async function sendTransfer(
  request: TransferRequest,
): Promise<TransferResult> {
  try {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    const movement: Movement = {
      id: `transfer-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'DEBITO',
      value: request.amount,
      description: `Transferencia a ${request.destinationPhone}`,
      status: 'EXITOSO',
    };
    addMovement(movement);
    return {
      success: true,
      message: 'Transferencia realizada correctamente.',
      movement,
    };
  } catch {
    throw new Error('No fue posible realizar la transferencia.');
  }
}
