import { DiscordTextChannel } from './discordtextchannel';
import { DiscordVoiceChannel } from './discordvoicechannel';

export interface DiscordGuild {
  id: string;
  channels: {
    resolve: (
      channelID: string,
    ) => DiscordVoiceChannel | DiscordTextChannel | null;
  };
}
