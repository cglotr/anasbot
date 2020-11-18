import Discord from 'discord.js';
import { DiscordGuild } from '../discord/discordguild';
import { DiscordService } from '../services/discordservice';
import { EnvironmentService } from '../services/environmentservice';
import { LoggerService } from '../services/loggerservice';
import { VoiceChannelService } from '../services/voicechannelservice';
import { VoiceChannel } from '../types/voicechannel';
import { RoomManager } from './roommanager';

export class RoomManagerImpl implements RoomManager {
  private voiceChannelService: VoiceChannelService;

  private discordService: DiscordService;

  private loggerService: LoggerService;

  private guild: DiscordGuild;

  private userQueue: { user: Discord.User; channel: VoiceChannel }[];

  constructor(
    voiceChannelService: VoiceChannelService,
    discordService: DiscordService,
    loggerService: LoggerService,
    environmentService: EnvironmentService,
    guild: DiscordGuild,
  ) {
    this.voiceChannelService = voiceChannelService;
    this.discordService = discordService;
    this.loggerService = loggerService;
    this.guild = guild;
    environmentService.getDefaultVoiceChannels().forEach((channelID) => {
      this.addVoiceChannel(channelID);
    });
    this.userQueue = [];
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
    const channel = this.discordService.getDiscordVoiceChannel(
      this.guild.channels.resolve(channelID),
    );
    if (channel) {
      channel.createInvite({ maxAge: 0 }).then((invite) => {
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
      });
    }
  }

  public addUserToQueue(user: Discord.User, channel: VoiceChannel) {
    this.userQueue.push({ user, channel });
  }

  public workOnQueues() {
    this.loggerService.info(`queues:${JSON.stringify(this.userQueue)}`);
    for (let i = 0; i < this.userQueue.length; i++) {
      const { user, channel } = this.userQueue[i];
      const requested_room = this.listTrackedRooms().find(
        (room) => room.id == channel.id,
      );
      if (requested_room) {
        const left = requested_room.userLimit - requested_room.userCount;
        if (left > 0) {
          const index = this.listTrackedRooms().findIndex(
            (room) => room.id == channel.id,
          );
          user.createDM().then((dmChannel) => dmChannel.send(channel.link));
          this.userQueue.splice(index, 1);
          i -= 1;
        }
      }
    }
  }
}
