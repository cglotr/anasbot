import { VoiceChannel } from '../types/voicechannel';

export interface VoiceChannelService {
  add(voiceChannel: VoiceChannel): void;
  list(): VoiceChannel[];
  updateUserCount(voiceChannelID: string, userCount: number): boolean;
  remove(voiceChannelID: string): void;
}
