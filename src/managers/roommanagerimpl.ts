import Discord from 'discord.js';
import { LoggerService } from '../services/loggerservice';
import { VoiceChannelService } from '../services/voicechannelservice';
import { VoiceChannel } from '../types/voicechannel';
import { getEnv } from '../utils/getenv';
import { RoomManager } from './roommanager';

export class RoomManagerImpl implements RoomManager {
  voiceChannelService: VoiceChannelService;

  constructor(
    voiceChannelService: VoiceChannelService,
    loggerService: LoggerService,
    guild: Discord.Guild,
  ) {
    this.voiceChannelService = voiceChannelService;

    getEnv(process.env.DEFAULT_VOICE_CHANNELS).forEach((channelID) => {
      const channel = guild.channels.resolve(channelID);
      if (channel && channel instanceof Discord.VoiceChannel) {
        channel
          .createInvite({ maxAge: 0 })
          .then((invite) => {
            this.voiceChannelService.add({
              id: channel.id,
              name: channel.name,
              userCount: channel.members.size,
              userLimit: channel.userLimit,
              link: invite.url,
              position: channel.position,
            });
            loggerService.info(
              `added room to game channels: id=${channel.id}, name=${channel.name}`,
            );
          })
          .catch((err) => {
            loggerService.error(`error creating invite`, err);
          });
      }
    });
  }

  listTrackedRooms(): VoiceChannel[] {
    return this.voiceChannelService.list();
  }

  listAvailableRooms(max: number): VoiceChannel[] {
    return this.listTrackedRooms()
      .filter((channel) => {
        const freeSlot = channel.userLimit - channel.userCount;
        return freeSlot > 0 && channel.userCount > 0;
      })
      .sort((a, b) => {
        return b.userCount - a.userCount;
      })
      .slice(0, max);
  }

  updateRoomUserCount(voiceChannelID: string, userCount: number): void {
    this.voiceChannelService.updateUserCount(voiceChannelID, userCount);
  }
}
