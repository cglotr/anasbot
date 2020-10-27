import { VoiceChannel } from '../types/voicechannel';
import { VoiceChannelService } from './voicechannelservice';

export class VoiceChannelServiceImpl implements VoiceChannelService {
  voiceChannels: Map<string, VoiceChannel>;

  constructor() {
    this.voiceChannels = new Map();
  }

  add(voiceChannel: VoiceChannel): void {
    this.voiceChannels.set(voiceChannel.id, voiceChannel);
  }

  list(): VoiceChannel[] {
    return Array.from(this.voiceChannels.values());
  }

  update(voiceChannel: VoiceChannel): boolean {
    if (!this.voiceChannels.has(voiceChannel.id)) {
      return false;
    }
    this.voiceChannels.set(voiceChannel.id, voiceChannel);
    return true;
  }

  remove(voiceChannelID: string): void {
    this.voiceChannels.delete(voiceChannelID);
  }
}
