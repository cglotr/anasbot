export interface EnvironmentService {
  getDiscordToken(): string;
  getGuildID(): string;
  getDefaultNotificationChannels(): string[];
  getDefaultVoiceChannels(): string[];
  getDefaultQuickChannels(): string[];
  getAlertInterval(): number;
  getSolveQueueInterval(): number;
}
