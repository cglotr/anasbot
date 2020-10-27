import Discord from 'discord.js';
import { VoiceChannelService } from '../services/voicechannelservice';
import { VoiceChannel } from '../types/voicechannel';
import { RoomManager } from './roommanager';

export class RoomManagerImpl implements RoomManager {
  voiceChannelService: VoiceChannelService;

  constructor(voiceChannelService: VoiceChannelService, guild: Discord.Guild) {
    this.voiceChannelService = voiceChannelService;

    guild.channels.cache.forEach((channel) => {
      if (channel instanceof Discord.VoiceChannel) {
        if (channel.userLimit === 10) {
          channel.createInvite().then((invite) => {
            this.voiceChannelService.add({
              id: channel.id,
              name: channel.name,
              userCount: channel.members.size,
              userLimit: channel.userLimit,
              link: invite.url,
              position: channel.position,
            });
          });
        }
      }
    });
  }

  listTrackedRooms(): VoiceChannel[] {
    return this.voiceChannelService.list();
  }

  listAvailableRooms(): VoiceChannel[] {
    return this.listTrackedRooms().filter((channel) => {
      const freeSlot = channel.userLimit - channel.userCount;
      return freeSlot > 0;
    });
  }
}
