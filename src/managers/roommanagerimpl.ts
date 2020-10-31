import Discord from 'discord.js';
import { VoiceChannelService } from '../services/voicechannelservice';
import { VoiceChannel } from '../types/voicechannel';
import { RoomManager } from './roommanager';

const AMONG_US_ROOM_SIZE = 10;

export class RoomManagerImpl implements RoomManager {
  voiceChannelService: VoiceChannelService;

  constructor(voiceChannelService: VoiceChannelService, guild: Discord.Guild) {
    this.voiceChannelService = voiceChannelService;

    guild.channels.cache.forEach((channel) => {
      if (channel instanceof Discord.VoiceChannel) {
        if (channel.userLimit === AMONG_US_ROOM_SIZE) {
          channel.createInvite({ maxAge: 0 }).then((invite) => {
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

  listAvailableRooms(max: number): VoiceChannel[] {
    return this.listTrackedRooms()
      .filter((channel) => {
        const freeSlot = channel.userLimit - channel.userCount;
        return freeSlot > 0 && channel.userCount > 0;
      })
      .sort((a, b) => {
        const aFreeSlot = a.userLimit - a.userCount;
        const bFreeSlot = b.userLimit - b.userCount;
        return bFreeSlot - aFreeSlot;
      })
      .slice(0, max);
  }
}
