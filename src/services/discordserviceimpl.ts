import Discord from 'discord.js';
import { DiscordTextChannel } from '../discord/discordtextchannel';
import { DiscordVoiceChannel } from '../discord/discordvoicechannel';
import { DiscordService } from './discordservice';

export class DiscordServiceImpl implements DiscordService {
  public getDiscordVoiceChannel(
    channel: DiscordVoiceChannel | DiscordTextChannel | null,
  ): DiscordVoiceChannel | null {
    return channel instanceof Discord.VoiceChannel ? channel : null;
  }

  public getDiscordTextChannel(
    channel: DiscordVoiceChannel | DiscordTextChannel | null,
  ): DiscordTextChannel | null {
    return channel instanceof Discord.TextChannel ? channel : null;
  }
}
