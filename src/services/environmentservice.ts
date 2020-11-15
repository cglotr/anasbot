export interface EnvironmentService {
  getDiscordToken(): string;
  getGuildID(): string;
  getDefaultNotificationChannels(): string[];
  getDefaultVoiceChannels(): string[];
  getAlertInterval(): number;
}
