import Discord from 'discord.js';
import { VoiceChannel } from '../types/voicechannel';

export interface RoomManager {
  add(channelID: string): void;
  listTrackedRooms(): VoiceChannel[];
  listAvailableRooms(max: number): VoiceChannel[];
  updateRoomUserCount(voiceChannelID: string, userCount: number): void;
  remove(channelID: string): void;
  addUserToQueue(user: Discord.User, channel: VoiceChannel): void;
  workOnQueues(): void;
}
