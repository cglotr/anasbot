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
    let message = ``;
    channels
      .sort((a, b) => a.position - b.position)
      .forEach((channel) => {
        message += `${this.printRoomSlot(channel)} ${channel.name}: ${
          channel.link
        }\n`;
      });
    if (channels.length < 1) {
      message += `_None_`;
    }
    return message;
  }

  printRoomSlot(channel: VoiceChannel): string {
    return `[${channel.userCount
      .toString()
      .padStart(2, '0')}/${channel.userLimit.toString().padStart(2, '0')}]`;
  }

  printTextChannels(channels: TextChannel[]): string {
    let message = '**Text Channels:**\n';
    channels.forEach((channel) => {
      message += `- ${channel.name}: \`${channel.id}\`\n`;
    });
    if (channels.length < 1) {
      message += `_None_`;
    }
    return message;
  }
}
