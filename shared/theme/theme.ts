export const colors = {
  primary: '#9D174D',
  secondary: '#FCE9F0',
  textPrimary: '#000000',
  textSecondary: '#6B7280',
  background: '#F9FAFB',
  error: '#DC2626',
  errorBackground: '#FEE2E2',
  success: '#059669',
  successBackground: '#D1FAE5',
  border: '#E5E7EB',
  overlay: 'rgba(17,24,39,0.45)',
  white: '#FFFFFF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const typography = {
  amount: 32,
  title: 24,
  body: 16,
  label: 12,
  caption: 14,
} as const;

export const radius = { sm: 8, md: 12, pill: 999 } as const;

export const componentSizes = {
  buttonHeight: 56,
  inputHeight: 52,
  icon: 40,
} as const;

export const validationText = {
  color: colors.error,
  fontSize: typography.caption,
  marginTop: spacing.xs,
} as const;
