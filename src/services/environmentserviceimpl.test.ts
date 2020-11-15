import {
  ALERT_INTERVAL,
  DEFAULT_NOTIFICATION_CHANNELS,
  DEFAULT_VOICE_CHANNELS,
  DISCORD_TOKEN,
  GUILD_ID,
} from '../constants';
import { EnvironmentService } from './environmentservice';
import { EnvironmentServiceImpl } from './environmentserviceimpl';

process.env[DEFAULT_NOTIFICATION_CHANNELS] =
  'default-notification-channel-1,default-notification-channel-2';
process.env[DEFAULT_VOICE_CHANNELS] =
  'default-voice-channel-1,default-voice-channel-2';
process.env[DISCORD_TOKEN] = 'discord-token';
process.env[GUILD_ID] = 'guild-id';

describe('EnvironmentServiceImpl', () => {
  let environmentService: EnvironmentService;

  beforeEach(() => {
    environmentService = new EnvironmentServiceImpl();
  });

  test('getDefaultNotificationChannels()', () => {
    expect(environmentService.getDefaultNotificationChannels()).toEqual([
      'default-notification-channel-1',
      'default-notification-channel-2',
    ]);
  });

  test('getDefaultVoiceChannels()', () => {
    expect(environmentService.getDefaultVoiceChannels()).toEqual([
      'default-voice-channel-1',
      'default-voice-channel-2',
    ]);
  });

  test('getDiscordToken()', () => {
    expect(environmentService.getDiscordToken()).toEqual('discord-token');
  });

  test('getGuildID()', () => {
    delete process.env[GUILD_ID];
    expect(environmentService.getGuildID()).toEqual('');

    process.env[GUILD_ID] = 'guild-id';
    expect(environmentService.getGuildID()).toEqual('guild-id');
  });

  test('getAlertInterval()', () => {
    delete process.env[ALERT_INTERVAL];
    expect(environmentService.getAlertInterval()).toEqual(0);

    process.env[ALERT_INTERVAL] = '300';
    expect(environmentService.getAlertInterval()).toEqual(300);
  });
});
