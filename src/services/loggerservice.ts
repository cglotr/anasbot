export interface LoggerService {
  info(message: string): void;
  warning(message: string): void;
  error(message: string): void;
}
