// src/lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const logger = {
  debug: (msg: string, meta?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(msg, meta);
    }
  },
  info: (msg: string, meta?: unknown) => {
    console.info(msg, meta);
  },
  warn: (msg: string, meta?: unknown) => {
    console.warn(msg, meta);
  },
  error: (msg: string, meta?: unknown) => {
    console.error(msg, meta);
  },
};
