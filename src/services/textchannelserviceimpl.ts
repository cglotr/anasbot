import { TextChannel } from '../types/textchannel';
import { TextChannelService } from './textchannelservice';

export class TextChannelServiceImpl implements TextChannelService {
  private channels: Map<string, TextChannel>;

  constructor() {
    this.channels = new Map();
  }

  public add(channel: TextChannel): boolean {
    this.channels.set(channel.id, channel);
    return true;
  }

  public list(): Array<TextChannel> {
    return Array.from(this.channels.values());
  }

  public remove(channel: TextChannel): boolean {
    return this.removeByChannelID(channel.id);
  }

  public removeByChannelID(channelID: string): boolean {
    if (!this.channels.has(channelID)) {
      return false;
    }
    this.channels.delete(channelID);
    return true;
  }
}
