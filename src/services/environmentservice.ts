export interface EnvironmentService {
  getEnv(key: string): string;
  getEnvs(key: string): string[];
}
