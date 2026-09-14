import { NativeModules } from 'react-native';
import { BridgeEvent, Session } from '../theme/types';

interface SessionBridgeApi {
  emitLoginSuccess?: (session: Session) => void;
  emitEvent?: (event: BridgeEvent) => void;
}

const sessionBridge = NativeModules.SessionBridge as
  | SessionBridgeApi
  | undefined;
const bridgeListeners = new Set<(event: BridgeEvent) => void>();

export function subscribeToBridgeEvents(
  listener: (event: BridgeEvent) => void,
) {
  bridgeListeners.add(listener);
  return () => {
    bridgeListeners.delete(listener);
  };
}

export function emitBridgeEvent(event: BridgeEvent) {
  console.log('[Bridge] Evento emitido:', event.type, event);

  bridgeListeners.forEach(listener => {
    try {
      listener(event);
    } catch {
      // Si algo falla acá, no quiero que se caiga el bridge de verdad, solo lo ignoro.
    }
  });

  try {
    if (event.type === 'LOGIN_SUCCESS' && sessionBridge?.emitLoginSuccess) {
      sessionBridge.emitLoginSuccess(event.payload);
      return;
    }
    sessionBridge?.emitEvent?.(event);
  } catch {
    // Si no hay bridge nativo conectado (por ejemplo probando el bundle solo), que no rompa la app.
  }
}
