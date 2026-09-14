import { getCurrentBalance, getMovements } from '../../../../shared/state/movementsStore';
import { DEV_USER } from '../../../../shared/theme/devData';
import { Movement, User } from '../../../../shared/theme/types';

export async function loadHome(): Promise<{
  user: User;
  movements: Movement[];
}> {
  try {
    return {
      user: { ...DEV_USER, balance: getCurrentBalance() },
      movements: getMovements().slice(0, 3),
    };
  } catch {
    throw new Error('No fue posible cargar tu información.');
  }
}
