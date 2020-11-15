import { DiscordGuild } from '../discord/discordguild';
import { DiscordService } from '../services/discordservice';
import { EnvironmentService } from '../services/environmentservice';
import { LoggerService } from '../services/loggerservice';
import { TextChannelService } from '../services/textchannelservice';
import { TextChannel } from '../types/textchannel';
import { QuickManager } from './quickmanager';

export class QuickManagerImpl implements QuickManager {
  private textChannelService: TextChannelService;

  constructor(
    textChannelService: TextChannelService,
    discordService: DiscordService,
    loggerService: LoggerService,
    environmentService: EnvironmentService,
    guild: DiscordGuild,
  ) {
    this.textChannelService = textChannelService;
    environmentService.getDefaultQuickChannels().forEach((channelID) => {
      const channel = discordService.getDiscordTextChannel(
        guild.channels.resolve(channelID),
      );
      if (channel) {
        this.textChannelService.add({
          id: channel.id,
          name: channel.name,
        });
        loggerService.info(
          `room added to quicks: id=${channel.id}, name=${channel.name}`,
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
