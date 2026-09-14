import { Movement } from '../../../../shared/theme/types';
import { getMovements as getStoredMovements } from '../../../../shared/state/movementsStore';

export async function getMovements(page: number): Promise<Movement[]> {
  try {
    await new Promise<void>(resolve => setTimeout(resolve, 350));
    return getStoredMovements().slice(page * 4, page * 4 + 4);
  } catch {
    throw new Error('No fue posible cargar los movimientos.');
  }
}
