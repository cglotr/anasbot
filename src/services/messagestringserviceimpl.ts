import { TextChannel } from '../types/textchannel';
import { VoiceChannel } from '../types/voicechannel';
import { MessageStringService } from './messagestringservice';

export class MessageStringServiceImpl implements MessageStringService {
  public printNotificationChannels(channels: Array<TextChannel>): string {
    let message = '**Notification Channels:**\n';
    channels.forEach((channel) => {
      message += `- ${channel.name}\n`;
    });
    if (channels.length < 1) {
      message += `_None_`;
    }
    return message;
  }

  public printGameChannels(channels: Array<VoiceChannel>): string {
    let message = '**Among Us Channels:**\n';
    channels
      .sort((a, b) => a.position - b.position)
      .forEach((channel) => {
        message += `- ${channel.name}: \`${channel.id}\`\n`;
      });
    if (channels.length < 1) {
      message += `_None_`;
    }
    return message;
  }

  public printAvailableGameChannels(channels: Array<VoiceChannel>): string {
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

  public printRoomSlot(channel: VoiceChannel): string {
    return `\`[${channel.userCount
      .toString()
      .padStart(2, '0')}/${channel.userLimit.toString().padStart(2, '0')}]\``;
  }

  public printTextChannels(channels: TextChannel[]): string {
    return `**Text Channels:**\n${this.printChannels(channels)}`;
  }

  public printVoiceChannels(channels: VoiceChannel[]): string {
    return `**Voice Channels:**\n${this.printChannels(channels)}`;
  }

  private printChannels(channels: { name: string; id: string }[]): string {
    let message = ``;
    channels.forEach((channel) => {
      message += `- ${channel.name}: \`${channel.id}\`\n`;
    });
    if (channels.length < 1) {
      message += `_None_`;
    }
    return message;
  }
}
