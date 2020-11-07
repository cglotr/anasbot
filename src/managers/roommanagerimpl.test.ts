import { DiscordGuild } from '../discord/discordguild';
import { DiscordInvite } from '../discord/discordinvite';
import { DiscordVoiceChannel } from '../discord/discordvoicechannel';
import { EnvironmentServiceImpl } from '../services/environmentserviceimpl';
import { LoggerServiceImpl } from '../services/loggerserviceimpl';
import { VoiceChannelServiceImpl } from '../services/voicechannelserviceimpl';
import { wait } from '../utils/wait';
import { RoomManager } from './roommanager';
import { RoomManagerImpl } from './roommanagerimpl';

describe('RoomManagerImpl', () => {
  let roomManager: RoomManager;

  let discordGuild: DiscordGuild;
  let discordVoiceChannel: DiscordVoiceChannel;
  let discordInvite: DiscordInvite;

  beforeEach(() => {
    discordInvite = {
      url: 'discord-invite-url',
    };
    discordVoiceChannel = {
      id: 'channel-id',
      name: 'channel-name',
      members: {
        size: 9,
      },
      userLimit: 10,
      position: 0,
      type: 'voice',
      createInvite: jest.fn(async () => {
        return new Promise((resolve) => {
          resolve(discordInvite);
        });
      }),
    };
    discordGuild = {
      channels: {
        resolve: jest.fn(() => {
          return discordVoiceChannel;
        }),
      },
    };
    roomManager = new RoomManagerImpl(
      new VoiceChannelServiceImpl(),
      new LoggerServiceImpl(),
      new EnvironmentServiceImpl(),
      discordGuild,
    );
  });

  it('should add & remove voice channel', async () => {
    roomManager.add('channel-id');
    await wait();

    expect(discordGuild.channels.resolve).toHaveBeenCalledWith('channel-id');
    expect(discordVoiceChannel.createInvite).toHaveBeenCalledWith({
      maxAge: 0,
    });
    expect(roomManager.listTrackedRooms().length).toBe(1);
    expect(roomManager.listTrackedRooms()[0]).toEqual({
      id: 'channel-id',
      name: 'channel-name',
      userCount: 9,
      userLimit: 10,
      link: 'discord-invite-url',
      position: 0,
    });

    roomManager.remove('channel-id');
    await wait();

    expect(roomManager.listTrackedRooms().length).toBe(0);
  });
});
