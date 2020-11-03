import { getEnv } from '../utils/getenv';
import { EnvironmentService } from './environmentservice';

export class EnvironmentServiceImpl implements EnvironmentService {
  getEnv(key: string): string {
    const values = getEnv(key);
    if (values.length < 1) return '';
    return values[0];
  }

  getEnvs(key: string): string[] {
    return getEnv(key);
  }
}
