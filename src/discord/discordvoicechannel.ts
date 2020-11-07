import { DiscordInvite } from './discordinvite';

export interface DiscordVoiceChannel {
  id: string;
  name: string;
  members: {
    size: number;
  };
  userLimit: number;
  position: number;
  createInvite(options?: { maxAge: number }): Promise<DiscordInvite>;
}
