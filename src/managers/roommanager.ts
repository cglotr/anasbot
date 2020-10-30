import { VoiceChannel } from '../types/voicechannel';

export interface RoomManager {
  listTrackedRooms(): VoiceChannel[];
  listAvailableRooms(max: number): VoiceChannel[];
}
