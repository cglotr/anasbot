import { VoiceChannel } from '../types/voicechannel';

export interface VoiceChannelService {
  add(voiceChannel: VoiceChannel): void;
  list(): VoiceChannel[];
  update(voiceChannel: VoiceChannel): boolean;
  remove(voiceChannelID: string): void;
}
