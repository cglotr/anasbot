import { DiscordTextChannel } from '../discord/discordtextchannel';
import { DiscordVoiceChannel } from '../discord/discordvoicechannel';

export interface DiscordService {
  getDiscordVoiceChannel(
    channel: DiscordVoiceChannel | DiscordTextChannel | null,
  ): DiscordVoiceChannel | null;
  getDiscordTextChannel(
    channel: DiscordVoiceChannel | DiscordTextChannel | null,
  ): DiscordTextChannel | null;
}
