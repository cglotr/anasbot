import { DiscordService } from './discordservice';
import { DiscordServiceImpl } from './discordserviceimpl';

describe('DiscordServiceImpl', () => {
  let discordService: DiscordService;

  beforeEach(() => {
    discordService = new DiscordServiceImpl();
  });

  test('getDiscordVoiceChannel()', () => {
    expect(discordService.getDiscordVoiceChannel(null)).toBeNull();
  });

  test('getDiscordTextChannel()', () => {
    expect(discordService.getDiscordTextChannel(null)).toBeNull();
  });
});
