import Discord from 'discord.js';
import { DEFAULT_NOTIFICATION_CHANNELS } from '../constants';
import { EnvironmentService } from '../services/environmentservice';
import { LoggerService } from '../services/loggerservice';
import { TextChannelService } from '../services/textchannelservice';
import { TextChannel } from '../types/textchannel';
import { NotificationManager } from './notificationmanager';

export class NotificationManagerImpl implements NotificationManager {
  private textChannelService: TextChannelService;

  constructor(
    textChannelService: TextChannelService,
    loggerService: LoggerService,
    environmentService: EnvironmentService,
    guild: Discord.Guild,
  ) {
    this.textChannelService = textChannelService;
    environmentService
      .getEnvs(DEFAULT_NOTIFICATION_CHANNELS)
      .forEach((channelID) => {
        const channel = guild.channels.resolve(channelID);
        if (channel instanceof Discord.TextChannel) {
          this.textChannelService.add({
            id: channel.id,
            name: channel.name,
          });
          loggerService.info(
            `room added to alerts: id=${channel.id}, name=${channel.name}`,
          );
        }
      });
  }

  public add(textChannel: TextChannel): boolean {
    return this.textChannelService.add(textChannel);
  }

  public list(): TextChannel[] {
    return this.textChannelService.list();
  }

  public remove(textChannel: TextChannel): boolean {
    return this.textChannelService.remove(textChannel);
  }

  public removeByChannelID(textChannelID: string): boolean {
    return this.textChannelService.removeByChannelID(textChannelID);
  }
}
