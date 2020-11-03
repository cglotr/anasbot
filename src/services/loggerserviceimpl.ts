import { LoggerService } from './loggerservice';

export class LoggerServiceImpl implements LoggerService {
  info(message: string) {
    // eslint-disable-next-line no-console
    console.log('[info]', message);
  }

  warning(message: string) {
    // eslint-disable-next-line no-console
    console.warn('[warn]', message);
  }

  error(message: string, err: any) {
    // eslint-disable-next-line no-console
    console.error('[errr]', message);

    // eslint-disable-next-line no-console
    console.error(err);
  }
}
