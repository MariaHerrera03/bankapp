import { useEffect, useState } from 'react';
import { Movement, User } from '../../../../shared/theme/types';
import { loadHome } from '../services/homeService';

export function useHome() {
  const [user, setUser] = useState<User | null>(null);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    loadHome()
      .then(data => {
        setUser(data.user);
        setMovements(data.movements);
      })
      .catch(requestError =>
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Error de carga.',
        ),
      );
  }, []);
  return { user, movements, error };
}
