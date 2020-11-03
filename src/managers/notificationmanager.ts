import { TextChannel } from '../types/textchannel';

export interface NotificationManager {
  add(textChannel: TextChannel): boolean;
  list(): TextChannel[];
  remove(textChannel: TextChannel): boolean;
  removeByChannelID(textChannelID: string): boolean;
}
