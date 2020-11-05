import Discord from 'discord.js';
import { LoggerService } from '../services/loggerservice';
import { VoiceChannelService } from '../services/voicechannelservice';
import { VoiceChannel } from '../types/voicechannel';
import { getEnv } from '../utils/getenv';
import { RoomManager } from './roommanager';

export class RoomManagerImpl implements RoomManager {
  private voiceChannelService: VoiceChannelService;

  private loggerService: LoggerService;

  private guild: Discord.Guild;

  constructor(
    voiceChannelService: VoiceChannelService,
    loggerService: LoggerService,
    guild: Discord.Guild,
  ) {
    this.voiceChannelService = voiceChannelService;
    this.loggerService = loggerService;
    this.guild = guild;
    getEnv(process.env.DEFAULT_VOICE_CHANNELS).forEach((channelID) => {
      this.addVoiceChannel(channelID);
    });
  }

  public add(channelID: string): void {
    this.addVoiceChannel(channelID);
    this.loggerService.info(`voice room added: ${channelID}`);
  }

  public listTrackedRooms(): VoiceChannel[] {
    return this.voiceChannelService.list();
  }

  public listAvailableRooms(max: number): VoiceChannel[] {
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

  public updateRoomUserCount(voiceChannelID: string, userCount: number): void {
    this.voiceChannelService.updateUserCount(voiceChannelID, userCount);
  }

  public remove(channelID: string): void {
    this.voiceChannelService.remove(channelID);
    this.loggerService.info(`voice room removed: ${channelID}`);
  }

  private addVoiceChannel(channelID: string) {
    const channel = this.guild.channels.resolve(channelID);
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
          this.loggerService.info(
            `added room to game channels: id=${channel.id}, name=${channel.name}`,
          );
        })
        .catch((err) => {
          this.loggerService.error(`error creating invite`, err);
        });
    }
  }
}
