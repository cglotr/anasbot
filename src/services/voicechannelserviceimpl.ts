import { VoiceChannel } from '../types/voicechannel';
import { VoiceChannelService } from './voicechannelservice';

export class VoiceChannelServiceImpl implements VoiceChannelService {
  private voiceChannels: Map<string, VoiceChannel>;

  constructor() {
    this.voiceChannels = new Map();
  }

  public add(voiceChannel: VoiceChannel): void {
    this.voiceChannels.set(voiceChannel.id, voiceChannel);
  }

  public list(): VoiceChannel[] {
    return Array.from(this.voiceChannels.values());
  }

  public updateUserCount(voiceChannelID: string, userCount: number): boolean {
    const voiceChannel = this.voiceChannels.get(voiceChannelID);
    if (!voiceChannel) return false;
    voiceChannel.userCount = userCount;
    return true;
  }

  public remove(voiceChannelID: string): void {
    this.voiceChannels.delete(voiceChannelID);
  }
}
