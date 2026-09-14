import { Session } from '../../../../shared/theme/types';
import { DEV_CREDENTIALS, DEV_USER } from '../../../../shared/theme/devData';

export async function authenticate(
  username: string,
  password: string,
): Promise<Session> {
  try {
    await new Promise<void>(resolve => setTimeout(resolve, 350));
    if (
      username.trim() !== DEV_CREDENTIALS.username ||
      password !== DEV_CREDENTIALS.password
    ) {
      throw new Error('Usuario o contraseña incorrectos.');
    }
    return {
      sessionId: 'session-local',
      userId: DEV_USER.userId,
      name: DEV_USER.name,
      phone: DEV_USER.phone,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'No fue posible iniciar sesión.',
    );
  }
}
