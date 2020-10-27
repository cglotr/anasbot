/* eslint-disable no-console */

import { ConsoleLogger, Logger } from './logger';

describe('ConsoleLogger', () => {
  const logger: Logger = new ConsoleLogger();

  beforeEach(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  test('logging info', () => {
    logger.info('hello');
    expect(console.log).toHaveBeenCalledWith('[info]', 'hello');
  });

  test('logging warning', () => {
    logger.warning('hello');
    expect(console.warn).toHaveBeenCalledWith('[warn]', 'hello');
  });

  test('logging error', () => {
    logger.error('hello');
    expect(console.error).toHaveBeenCalledWith('[errr]', 'hello');
  });
});
