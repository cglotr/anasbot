import Discord from 'discord.js';
import { DiscordTextChannel } from '../discord/discordtextchannel';
import { DiscordVoiceChannel } from '../discord/discordvoicechannel';
import { DiscordService } from './discordservice';

export class DiscordServiceImpl implements DiscordService {
  public getDiscordVoiceChannel(
    channel: DiscordVoiceChannel | DiscordTextChannel | null,
  ): DiscordVoiceChannel | null {
    if (channel instanceof Discord.VoiceChannel) {
      return channel;
    }
    return null;
  }

  public getDiscordTextChannel(
    channel: DiscordVoiceChannel | DiscordTextChannel | null,
  ): DiscordTextChannel | null {
    if (channel instanceof Discord.TextChannel) {
      return channel;
    }
    return null;
  }
}
