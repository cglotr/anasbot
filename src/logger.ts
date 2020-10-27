export interface Logger {
  info(message: string): void;
  warning(message: string): void;
  error(message: string): void;
}

export class ConsoleLogger implements Logger {
  info(message: string) {
    // eslint-disable-next-line
    console.log('[info]', message);
  }

  warning(message: string) {
    // eslint-disable-next-line
    console.warn('[warn]', message);
  }

  error(message: string) {
    // eslint-disable-next-line
    console.error('[errr]', message);
  }
}
