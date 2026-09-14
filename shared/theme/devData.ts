import { Movement, User } from './types';

export const DEV_CREDENTIALS = {
  username: 'maria',
  password: '123456',
};

export const DEV_USER: User = {
  userId: 'user-001',
  name: 'Maria',
  phone: '3001234567',
  balance: 2450000,
  status: 'ACTIVE',
};

export const DEV_VALID_RECIPIENTS = [
  '3007654321',
  '3012345678',
  '3159876543',
  '3204567890',
];

export const DEV_MOVEMENTS: Movement[] = [
  {
    id: 'm1',
    date: new Date().toISOString(),
    type: 'DEBITO',
    value: 85000,
    description: 'Transferencia enviada',
    status: 'EXITOSO',
  },
  {
    id: 'm2',
    date: new Date(Date.now() - 86400000).toISOString(),
    type: 'CREDITO',
    value: 320000,
    description: 'Pago recibido',
    status: 'EXITOSO',
  },
  {
    id: 'm3',
    date: new Date(Date.now() - 172800000).toISOString(),
    type: 'DEBITO',
    value: 42000,
    description: 'Compra con tarjeta',
    status: 'EXITOSO',
  },
];

export const DEV_MOVEMENTS_PAGED: Movement[] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: `movement-${index}`,
    date: new Date(Date.now() - index * 86400000).toISOString(),
    type: index % 2 ? 'CREDITO' : 'DEBITO',
    value: (index + 1) * 25000,
    description: index % 2 ? 'Pago recibido' : 'Compra con tarjeta',
    status: 'EXITOSO',
  }),
);
