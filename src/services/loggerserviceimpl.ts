import { LoggerService } from './loggerservice';

export class LoggerServiceImpl implements LoggerService {
  public info(message: string) {
    // eslint-disable-next-line no-console
    console.log('[info]', message);
  }

  public warning(message: string) {
    // eslint-disable-next-line no-console
    console.warn('[warn]', message);
  }

  public error(message: string, err: any) {
    // eslint-disable-next-line no-console
    console.error('[errr]', message);

    // eslint-disable-next-line no-console
    console.error(err);
  }
}
