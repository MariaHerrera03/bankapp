export interface Session {
  sessionId: string;
  userId: string;
  name: string;
  phone: string;
  expiresAt: string;
}

export interface User {
  userId: string;
  name: string;
  phone: string;
  balance: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Movement {
  id: string;
  date: string;
  type: 'DEBITO' | 'CREDITO';
  value: number;
  description: string;
  status: 'EXITOSO' | 'FALLIDO' | 'PENDIENTE';
}

export interface TransferRequest {
  originUserId: string;
  destinationPhone: string;
  amount: number;
}

export interface TransferResult {
  success: boolean;
  message: string;
  movement?: Movement;
}

export type BridgeEvent =
  | { type: 'LOGIN_SUCCESS'; payload: Session }
  | { type: 'LOAD_HOME'; payload: User }
  | { type: 'OPEN_TRANSFER' }
  | { type: 'OPEN_MOVEMENTS' }
  | { type: 'OPEN_HOME' }
  | { type: 'TRANSFER_SUCCESS'; payload: TransferResult }
  | { type: 'LOGOUT' }
  | { type: 'SESSION_EXPIRED' };
