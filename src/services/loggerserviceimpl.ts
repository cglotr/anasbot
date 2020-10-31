import { LoggerService } from './loggerservice';

export class LoggerServiceImpl implements LoggerService {
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
