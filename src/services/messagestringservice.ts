import { TextChannel } from '../types/textchannel';
import { VoiceChannel } from '../types/voicechannel';

export interface MessageStringService {
  printNotificationChannels(channels: Array<TextChannel>): string;
  printGameChannels(channels: Array<VoiceChannel>): string;
  printAvailableGameChannels(channels: Array<VoiceChannel>): string;
  printRoomSlot(channel: VoiceChannel): string;
  printTextChannels(channels: TextChannel[]): string;
  printVoiceChannels(channels: VoiceChannel[]): string;
}
