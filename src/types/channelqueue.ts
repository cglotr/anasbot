import Discord from 'discord.js';
import { VoiceChannel } from './voicechannel';

export type ChannelQueue = {
  user: Discord.User;
  channel: VoiceChannel;
};
