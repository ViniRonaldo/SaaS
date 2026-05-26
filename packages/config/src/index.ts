export const APP_CONFIG = {
  name: 'FilaSaúde',
  description: 'Sistema de gestão de filas para saúde pública municipal',
  version: '1.0.0',
  defaultLocale: 'pt-BR',
  supportedLocales: ['pt-BR', 'en-US'],
  pagination: {
    defaultPerPage: 20,
    maxPerPage: 100,
  },
  queue: {
    averageServiceTimeMinutes: 15,
    maxWaitTimeMinutes: 240,
    priorityWeights: {
      NORMAL: 1,
      ELDERLY: 3,
      PREGNANT: 3,
      DISABLED: 3,
      EMERGENCY: 5,
    },
  },
  auth: {
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d',
    saltRounds: 12,
  },
  notifications: {
    reminderHoursBefore: 24,
    queueProximityThreshold: 3,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
