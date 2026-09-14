import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { getCurrentBalance } from '../shared/state/movementsStore';
import { DEV_USER, DEV_VALID_RECIPIENTS } from '../shared/theme/devData';
import { useTransfer } from '../react-native-bundles/transfer-bundle/src/hooks/useTransfer';
import * as transferService from '../react-native-bundles/transfer-bundle/src/services/transferService';

jest.mock(
  '../react-native-bundles/transfer-bundle/src/services/transferService',
);

interface TransferHarnessProps {
  onSuccess: jest.Mock;
  onReady: (transfer: ReturnType<typeof useTransfer>) => void;
}

function TransferHarness({ onSuccess, onReady }: TransferHarnessProps) {
  const transfer = useTransfer(DEV_USER.phone, onSuccess);
  onReady(transfer);
  return null;
}

async function createTransferHarness(onSuccess = jest.fn()) {
  let currentTransfer!: ReturnType<typeof useTransfer>;
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <TransferHarness
        onSuccess={onSuccess}
        onReady={transfer => {
          currentTransfer = transfer;
        }}
      />,
    );
  });
  return { renderer, getTransfer: () => currentTransfer };
}

const validRecipient = DEV_VALID_RECIPIENTS[0];

beforeEach(() => {
  jest.mocked(transferService.sendTransfer).mockResolvedValue({
    success: true,
    message: 'Transferencia realizada correctamente.',
  });
});

test('amount less than or equal to zero produces a validation error', async () => {
  const transfer = await createTransferHarness();

  await ReactTestRenderer.act(async () => {
    transfer.getTransfer().setDestinationPhone(validRecipient);
    transfer.getTransfer().setAmountText('0');
  });

  expect(transfer.getTransfer().errors.amount).toBe(
    'El monto debe ser mayor a $0.',
  );
  await ReactTestRenderer.act(async () => {
    transfer.renderer.unmount();
  });
});

test('amount above the available balance produces a validation error', async () => {
  const transfer = await createTransferHarness();

  await ReactTestRenderer.act(async () => {
    transfer.getTransfer().setDestinationPhone(validRecipient);
    transfer.getTransfer().setAmountText(String(getCurrentBalance() + 1));
  });

  expect(transfer.getTransfer().errors.amount).toBe(
    'El monto supera tu saldo disponible.',
  );
  await ReactTestRenderer.act(async () => {
    transfer.renderer.unmount();
  });
});

test('transferring to the own phone produces an auto-transfer validation error', async () => {
  const transfer = await createTransferHarness();

  await ReactTestRenderer.act(async () => {
    transfer.getTransfer().setDestinationPhone(DEV_USER.phone);
    transfer.getTransfer().setAmountText('1000');
  });

  expect(transfer.getTransfer().errors.phone).toBe(
    'No puedes transferirte a tu propio número.',
  );
  await ReactTestRenderer.act(async () => {
    transfer.renderer.unmount();
  });
});

test('valid data allows confirmation, calls onSuccess, and clears the fields', async () => {
  const onSuccess = jest.fn();
  const transfer = await createTransferHarness(onSuccess);

  await ReactTestRenderer.act(async () => {
    transfer.getTransfer().setDestinationPhone(validRecipient);
    transfer.getTransfer().setAmountText('1000');
  });

  expect(transfer.getTransfer().canSubmit).toBe(true);
  await ReactTestRenderer.act(async () => {
    await transfer.getTransfer().confirm();
  });

  expect(transferService.sendTransfer).toHaveBeenCalledWith({
    originUserId: 'user-001',
    destinationPhone: validRecipient,
    amount: 1000,
  });
  expect(onSuccess).toHaveBeenCalled();
  expect(transfer.getTransfer().destinationPhone).toBe('');
  expect(transfer.getTransfer().amountText).toBe('');
  await ReactTestRenderer.act(async () => {
    transfer.renderer.unmount();
  });
});

test('a valid-format phone outside the development recipients produces a missing recipient error', async () => {
  const transfer = await createTransferHarness();

  await ReactTestRenderer.act(async () => {
    transfer.getTransfer().setDestinationPhone('3001111111');
    transfer.getTransfer().setAmountText('1000');
  });

  expect(transfer.getTransfer().errors.phone).toBe(
    'El destinatario no existe.',
  );
  await ReactTestRenderer.act(async () => {
    transfer.renderer.unmount();
  });
});
