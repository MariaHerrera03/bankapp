import { useState } from 'react';
import { authenticate } from '../services/authService';
import { Session } from '../../../../shared/theme/types';

export function useLogin(onSuccess: (session: Session) => void) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!username.trim() || !password) {
      setError('Completa usuario y contraseña.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      onSuccess(await authenticate(username, password));
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
    username,
    password,
    setUsername,
    setPassword,
    error,
    loading,
    submit,
  };
}
