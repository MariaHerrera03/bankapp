import { DEV_MOVEMENTS_PAGED, DEV_USER } from '../theme/devData';
import { Movement } from '../theme/types';

let movements = [...DEV_MOVEMENTS_PAGED];

export function addMovement(movement: Movement) {
  movements = [movement, ...movements];
}

export function getMovements(): Movement[] {
  return [...movements];
}

export function getCurrentBalance(): number {
  return movements.reduce(
    (balance, movement) =>
      movement.type === 'DEBITO'
        ? balance - movement.value
        : balance + movement.value,
    DEV_USER.balance,
  );
}
