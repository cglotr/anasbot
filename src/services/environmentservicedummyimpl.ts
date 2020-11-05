import { EnvironmentService } from './environmentservice';

export class EnvironmentServiceDummyImpl implements EnvironmentService {
  public getEnv(key: string): string {
    switch (key) {
      case 'DEFAULT_NOTIFICATION_CHANNELS':
        return 'noti-chan-1,noti-chan-2,noti-chan-3';
      case 'DEFAULT_VOICE_CHANNELS':
        return 'voice-chan-1,voice-chan-2,voice-chan-3';
      case 'DISCORD_TOKEN':
        return 'secret';
      case 'GUILD_ID':
        return 'among-us-sg';
      default:
        return '';
    }
  }

  public getEnvs(key: string): string[] {
    switch (key) {
      case 'DEFAULT_NOTIFICATION_CHANNELS':
        return ['noti-chan-1', 'noti-chan-2', 'noti-chan-3'];
      case 'DEFAULT_VOICE_CHANNELS':
        return ['voice-chan-1', 'voice-chan-2', 'voice-chan-3'];
      case 'DISCORD_TOKEN':
        return ['secret'];
      case 'GUILD_ID':
        return ['among-us-sg'];
      default:
        return [''];
    }
  }
}
