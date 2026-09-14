// Este archivo es solo mío, para probar las 4 pantallas sin tener el bridge de Android
// terminado. En la app real, quien decide qué pantalla mostrar es Kotlin, no esto.

import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './react-native-bundles/home-bundle/src/screens/HomeScreen';
import { LoginScreen } from './react-native-bundles/login-bundle/src/screens/LoginScreen';
import { MovementsScreen } from './react-native-bundles/movements-bundle/src/screens/MovementsScreen';
import { TransferScreen } from './react-native-bundles/transfer-bundle/src/screens/TransferScreen';
import {
  emitBridgeEvent,
  subscribeToBridgeEvents,
} from './shared/bridge/bridge';
import { colors, radius, spacing, typography } from './shared/theme/theme';

type PreviewScreen = 'login' | 'home' | 'transfer' | 'movements';

// Para probar rápido puedo bajar esto (ej: 15000 = 15 segundos), pero debe quedar en 3 min para la entrega.
const SESSION_DURATION_MS = 1 * 60 * 1000;

function formatRemainingTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function PreviewApp() {
  const [screen, setScreen] = useState<PreviewScreen>('login');
  const [sessionActive, setSessionActive] = useState(false);
  const [remainingMs, setRemainingMs] = useState(0);
  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearSessionTimers() {
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    sessionTimerRef.current = null;
    countdownTimerRef.current = null;
  }

  useEffect(() => {
    const unsubscribe = subscribeToBridgeEvents(event => {
      switch (event.type as string) {
        case 'LOGIN_SUCCESS': {
          clearSessionTimers();
          setSessionActive(true);
          setRemainingMs(SESSION_DURATION_MS);
          const sessionStartedAt = Date.now();
          sessionTimerRef.current = setTimeout(() => {
            sessionTimerRef.current = null;
            if (countdownTimerRef.current)
              clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
            setSessionActive(false);
            setRemainingMs(0);
            emitBridgeEvent({ type: 'SESSION_EXPIRED' });
          }, SESSION_DURATION_MS);
          countdownTimerRef.current = setInterval(() => {
            setRemainingMs(
              Math.max(
                0,
                SESSION_DURATION_MS - (Date.now() - sessionStartedAt),
              ),
            );
          }, 1000);
          setScreen('home');
          break;
        }
        case 'OPEN_HOME':
          setScreen('home');
          break;
        case 'OPEN_TRANSFER':
          setScreen('transfer');
          break;
        case 'OPEN_MOVEMENTS':
          setScreen('movements');
          break;
        case 'LOGOUT':
          clearSessionTimers();
          setSessionActive(false);
          setRemainingMs(0);
          setScreen('login');
          break;
      }
    });
    return () => {
      unsubscribe();
      clearSessionTimers();
    };
  }, []);

  function renderScreen() {
    switch (screen) {
      case 'home':
        return <HomeScreen />;
      case 'transfer':
        return <TransferScreen />;
      case 'movements':
        return <MovementsScreen />;
      case 'login':
      default:
        return <LoginScreen />;
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.previewBar}>
        <Text style={styles.previewLabel}>Preview RN</Text>
        <View style={styles.sessionBadge}>
          <Text style={styles.sessionStatus}>
            {sessionActive
              ? `Sesión activa · ${formatRemainingTime(remainingMs)}`
              : 'Sin sesión activa'}
          </Text>
        </View>
      </View>
      <View style={styles.screenContainer}>{renderScreen()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  previewBar: {
    backgroundColor: colors.textPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  previewLabel: {
    flex: 1,
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  sessionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sessionStatus: { color: colors.primary, fontSize: typography.label },
  screenContainer: { flex: 1 },
});

export default PreviewApp;
