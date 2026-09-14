import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  colors,
  componentSizes,
  radius,
  spacing,
  typography,
} from '../theme/theme';
import { Movement } from '../theme/types';

interface MovementCardProps {
  movement: Movement;
}

export function MovementCard({ movement }: MovementCardProps) {
  const isCredit = movement.type === 'CREDITO';
  const amount = `${isCredit ? '+' : '-'}$${movement.value.toLocaleString(
    'es-CO',
  )}`;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.icon,
          {
            backgroundColor: isCredit
              ? colors.successBackground
              : colors.secondary,
          },
        ]}
      >
        <Text
          style={[
            styles.iconText,
            { color: isCredit ? colors.success : colors.primary },
          ]}
        >
          {isCredit ? '+' : '-'}
        </Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.description}>{movement.description}</Text>
        <Text style={styles.date}>
          {new Date(movement.date).toLocaleString('es-CO')}
        </Text>
      </View>
      <Text
        style={[
          styles.amount,
          { color: isCredit ? colors.success : colors.textPrimary },
        ]}
      >
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  icon: {
    width: componentSizes.icon,
    height: componentSizes.icon,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 22, fontWeight: '700' },
  details: { flex: 1, marginLeft: spacing.md },
  description: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  date: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  amount: {
    fontSize: typography.body,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
});
