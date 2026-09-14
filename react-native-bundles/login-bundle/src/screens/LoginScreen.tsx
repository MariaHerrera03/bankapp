import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from '../../../../shared/assets/LogoBankApp.png';
import { emitBridgeEvent } from '../../../../shared/bridge/bridge';
import {
  colors,
  componentSizes,
  radius,
  spacing,
  typography,
  validationText,
} from '../../../../shared/theme/theme';
import { useLogin } from '../hooks/useLogin';

export function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin(session =>
    emitBridgeEvent({ type: 'LOGIN_SUCCESS', payload: session }),
  );
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Image
              source={logo}
              accessibilityLabel="BankApp"
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.title}>Bienvenido de nuevo</Text>
            <Text style={styles.subtitle}>
              Ingresa para consultar y mover tu dinero.
            </Text>
            <Text style={styles.label}>USUARIO</Text>
            <TextInput
              value={login.username}
              onChangeText={login.setUsername}
              autoCapitalize="none"
              style={styles.input}
              placeholder="Tu usuario"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.label}>CONTRASEÑA</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                value={login.password}
                onChangeText={login.setPassword}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                placeholder="Tu contraseña"
                placeholderTextColor={colors.textSecondary}
              />
              <Pressable
                onPress={() => setShowPassword(value => !value)}
                accessibilityLabel={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                style={styles.passwordToggle}
              >
                <Text style={styles.passwordToggleText}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </Pressable>
            </View>
            {login.error ? (
              <Text style={validationText}>{login.error}</Text>
            ) : null}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
              ]}
              onPress={login.submit}
              disabled={login.loading}
            >
              {login.loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Ingresar</Text>
              )}
            </Pressable>
            <Pressable>
              <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  keyboard: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  logo: {
    width: 170,
    height: 70,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.title,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
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
    fontSize: typography.body,
    backgroundColor: colors.white,
  },
  passwordContainer: {
    height: componentSizes.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  passwordToggle: { paddingHorizontal: spacing.md },
  passwordToggleText: {
    color: colors.primary,
    fontSize: typography.caption,
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
  pressed: { opacity: 0.8 },
  buttonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '700',
  },
  forgot: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: typography.caption,
    fontWeight: '600',
  },
});
