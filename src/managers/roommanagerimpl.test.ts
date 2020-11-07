import { DiscordGuild } from '../discord/discordguild';
import { DiscordInvite } from '../discord/discordinvite';
import { DiscordVoiceChannel } from '../discord/discordvoicechannel';
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
        size: 0,
      },
      userLimit: 10,
      position: 0,
      createInvite: jest.fn(async () => {
        return new Promise((resolve) => {
          resolve(discordInvite);
        });
      }),
    };
    discordGuild = {
      id: 'guild-id',
      channels: {
        resolve: jest.fn(() => {
          return discordVoiceChannel;
        }),
      },
    };
    roomManager = new RoomManagerImpl(
      new VoiceChannelServiceImpl(),
      {
        getDiscordVoiceChannel: jest.fn(() => discordVoiceChannel),
        getDiscordTextChannel: jest.fn(),
      },
      new LoggerServiceImpl(),
      {
        getDiscordToken: jest.fn(),
        getGuildID: jest.fn(),
        getDefaultNotificationChannels: jest.fn(),
        getDefaultVoiceChannels: jest.fn(() => ['channel-id']),
      },
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
      userCount: 0,
      userLimit: 10,
      link: 'discord-invite-url',
      position: 0,
    });

    roomManager.remove('channel-id');
    await wait();

    expect(roomManager.listTrackedRooms().length).toBe(0);
  });

  it('should update room user count & show room as available', async () => {
    roomManager.add('channel-id');
    await wait();

    expect(roomManager.listAvailableRooms(1).length).toBe(0);

    roomManager.updateRoomUserCount('not-found', 9);
    await wait();

    expect(roomManager.listAvailableRooms(1).length).toBe(0);

    roomManager.updateRoomUserCount('channel-id', 9);
    await wait();

    expect(roomManager.listAvailableRooms(1).length).toBe(1);
  });
});
