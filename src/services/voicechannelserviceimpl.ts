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

  updateUserCount(voiceChannelID: string, userCount: number): boolean {
    const voiceChannel = this.voiceChannels.get(voiceChannelID);
    if (!voiceChannel) return false;
    voiceChannel.userCount = userCount;
    return true;
  }

  remove(voiceChannelID: string): void {
    this.voiceChannels.delete(voiceChannelID);
  }
}
