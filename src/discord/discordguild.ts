import { DiscordVoiceChannel } from './discordvoicechannel';

export interface DiscordGuild {
  channels: {
    resolve: (channelID: string) => DiscordVoiceChannel | null;
  };
}
