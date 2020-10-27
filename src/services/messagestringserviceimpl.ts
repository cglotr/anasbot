import { TextChannel } from '../types/textchannel';
import { VoiceChannel } from '../types/voicechannel';
import { MessageStringService } from './messagestringservice';

export class MessageStringServiceImpl implements MessageStringService {
  printNotificationChannels(channels: Array<TextChannel>): string {
    let message = '**Notification Channels:**\n';
    channels.forEach((channel) => {
      message += `- ${channel.name}\n`;
    });
    if (channels.length < 1) {
      message += `_None_`;
    }
    return message;
  }

  printGameChannels(channels: Array<VoiceChannel>): string {
    let message = '**Among Us Channels:**\n';
    channels
      .sort((a, b) => a.position - b.position)
      .forEach((channel) => {
        message += `- ${channel.name}\n`;
      });
    if (channels.length < 1) {
      message += `_None_`;
    }
    return message;
  }

  printAvailableGameChannels(channels: Array<VoiceChannel>): string {
    let message = '**Available Among Us Channels:**\n';
    channels
      .sort((a, b) => a.position - b.position)
      .forEach((channel) => {
        message += `${channel.link}\n`;
      });
    if (channels.length < 1) {
      message += `_None_`;
    }
    return message;
  }
}
