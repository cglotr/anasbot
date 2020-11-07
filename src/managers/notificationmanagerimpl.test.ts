import { DiscordGuild } from '../discord/discordguild';
import { DiscordTextChannel } from '../discord/discordtextchannel';
import { LoggerServiceImpl } from '../services/loggerserviceimpl';
import { TextChannelServiceImpl } from '../services/textchannelserviceimpl';
import { NotificationManager } from './notificationmanager';
import { NotificationManagerImpl } from './notificationmanagerimpl';

describe('NotificationManagerImpl', () => {
  let notificationManager: NotificationManager;

  let discordGuild: DiscordGuild;
  let discordTextChannel: DiscordTextChannel;

  beforeEach(() => {
    discordTextChannel = {
      id: 'channel-id',
      name: 'channel-name',
    };
    discordGuild = {
      id: 'guild-id',
      channels: {
        resolve: jest.fn(() => {
          return discordTextChannel;
        }),
      },
    };
    notificationManager = new NotificationManagerImpl(
      new TextChannelServiceImpl(),
      {
        getDiscordVoiceChannel: jest.fn(),
        getDiscordTextChannel: jest.fn(() => null),
      },
      new LoggerServiceImpl(),
      {
        getDiscordToken: jest.fn(),
        getGuildID: jest.fn(),
        getDefaultNotificationChannels: jest.fn(() => ['channel-id']),
        getDefaultVoiceChannels: jest.fn(),
      },
      discordGuild,
    );
    expect(notificationManager.list().length).toBe(0);
  });

  it('should add text channel', () => {
    expect(notificationManager.list().length).toBe(0);

    notificationManager.add(discordTextChannel);
    expect(notificationManager.list().length).toBe(1);
  });

  it('should remove text channel', () => {
    expect(notificationManager.list().length).toBe(0);

    notificationManager.add(discordTextChannel);
    expect(notificationManager.list().length).toBe(1);

    notificationManager.remove(discordTextChannel);
    expect(notificationManager.list().length).toBe(0);
  });

  it('should remove text channel by channel id', () => {
    expect(notificationManager.list().length).toBe(0);

    notificationManager.add(discordTextChannel);
    expect(notificationManager.list().length).toBe(1);

    notificationManager.removeByChannelID(discordTextChannel.id);
    expect(notificationManager.list().length).toBe(0);
  });

  it('should add default text channel during initialization', () => {
    notificationManager = new NotificationManagerImpl(
      new TextChannelServiceImpl(),
      {
        getDiscordVoiceChannel: jest.fn(),
        getDiscordTextChannel: jest.fn(() => {
          return discordTextChannel;
        }),
      },
      new LoggerServiceImpl(),
      {
        getDiscordToken: jest.fn(),
        getGuildID: jest.fn(),
        getDefaultNotificationChannels: jest.fn(() => ['channel-id']),
        getDefaultVoiceChannels: jest.fn(),
      },
      discordGuild,
    );
    expect(notificationManager.list().length).toBe(1);
  });
});
