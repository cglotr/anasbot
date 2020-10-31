/* eslint-disable no-console */

import { LoggerService } from './loggerservice';
import { LoggerServiceImpl } from './loggerserviceimpl';

describe('LoggerServiceImpl', () => {
  const loggerService: LoggerService = new LoggerServiceImpl();

  beforeEach(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  test('logging info', () => {
    loggerService.info('hello');
    expect(console.log).toHaveBeenCalledWith('[info]', 'hello');
  });

  test('logging warning', () => {
    loggerService.warning('hello');
    expect(console.warn).toHaveBeenCalledWith('[warn]', 'hello');
  });

  test('logging error', () => {
    loggerService.error('hello');
    expect(console.error).toHaveBeenCalledWith('[errr]', 'hello');
  });
});
