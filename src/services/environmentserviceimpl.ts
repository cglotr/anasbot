import { getEnv } from '../utils/getenv';
import { EnvironmentService } from './environmentservice';

export class EnvironmentServiceImpl implements EnvironmentService {
  public getEnv(key: string): string {
    const values = getEnv(process.env[key]);
    if (values.length < 1) return '';
    return values[0];
  }

  public getEnvs(key: string): string[] {
    return getEnv(process.env[key]);
  }
}
