import { TextChannel } from '../types/textchannel';
import { TextChannelService } from './textchannelservice';

export class TextChannelServiceImpl implements TextChannelService {
  channels: Map<string, TextChannel>;

  constructor() {
    this.channels = new Map();
  }

  add(channel: TextChannel): boolean {
    this.channels.set(channel.id, channel);
    return true;
  }

  list(): Array<TextChannel> {
    return Array.from(this.channels.values());
  }

  remove(channel: TextChannel): boolean {
    return this.removeByChannelID(channel.id);
  }

  removeByChannelID(channelID: string): boolean {
    if (!this.channels.has(channelID)) {
      return false;
    }
    this.channels.delete(channelID);
    return true;
  }
}
