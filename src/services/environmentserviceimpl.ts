import {
  ALERT_INTERVAL,
  DEFAULT_NOTIFICATION_CHANNELS,
  DEFAULT_QUICK_CHANNELS,
  DEFAULT_VOICE_CHANNELS,
  DISCORD_TOKEN,
  GUILD_ID,
} from '../constants';
import { getEnv } from '../utils/getenv';
import { EnvironmentService } from './environmentservice';

export class EnvironmentServiceImpl implements EnvironmentService {
  public getDiscordToken(): string {
    return this.getEnv(DISCORD_TOKEN);
  }

  public getGuildID(): string {
    return this.getEnv(GUILD_ID);
  }

  public getDefaultNotificationChannels(): string[] {
    return this.getEnvs(DEFAULT_NOTIFICATION_CHANNELS);
  }

  public getDefaultVoiceChannels(): string[] {
    return this.getEnvs(DEFAULT_VOICE_CHANNELS);
  }

  public getDefaultQuickChannels(): string[] {
    return this.getEnvs(DEFAULT_QUICK_CHANNELS);
  }

  public getAlertInterval(): number {
    const value = parseInt(this.getEnv(ALERT_INTERVAL), 10);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(value)) {
      return 0;
    }
    return value;
  }

  private getEnv(key: string): string {
    const values = getEnv(process.env[key]);
    if (values.length < 1) return '';
    return values[0];
  }

  private getEnvs(key: string): string[] {
    return getEnv(process.env[key]);
  }
}
