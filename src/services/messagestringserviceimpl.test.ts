import { TextChannel } from '../types/textchannel';
import { VoiceChannel } from '../types/voicechannel';
import { MessageStringServiceImpl } from './messagestringserviceimpl';

describe('MessageStringServiceImpl', () => {
  const voiceChannels: VoiceChannel[] = [
    {
      id: '4',
      name: 'voice-channel-4',
      userCount: 0,
      userLimit: 10,
      link: 'voice-channel-4-link',
      position: 4,
    },
    {
      id: '3',
      name: 'voice-channel-3',
      userCount: 10,
      userLimit: 10,
      link: 'voice-channel-3-link',
      position: 3,
    },
    {
      id: '2',
      name: 'voice-channel-2',
      userCount: 1,
      userLimit: 10,
      link: 'voice-channel-2-link',
      position: 2,
    },
    {
      id: '1',
      name: 'voice-channel-1',
      userCount: 9,
      userLimit: 10,
      link: 'voice-channel-1-link',
      position: 1,
    },
  ];

  const textChannels: TextChannel[] = [
    {
      id: '1',
      name: 'text-channel-1',
    },
    {
      id: '2',
      name: 'text-channel-2',
    },
  ];

  let messageStringService: MessageStringServiceImpl;

  beforeEach(() => {
    messageStringService = new MessageStringServiceImpl();
  });

  test('printNotificationChannels()', () => {
    const actual = messageStringService.printNotificationChannels(textChannels);
    expect(actual).toEqual(
      '**Notification Channels:**\n- text-channel-1\n- text-channel-2\n',
    );
  });

  test('printGameChannels()', () => {
    const actual = messageStringService.printGameChannels(voiceChannels);
    expect(actual).toEqual(
      '**Among Us Channels:**\n- voice-channel-1: `1`\n- voice-channel-2: `2`\n- voice-channel-3: `3`\n- voice-channel-4: `4`\n',
    );
  });

  test('printAvailableGameChannels()', () => {
    const actual = messageStringService.printAvailableGameChannels(
      voiceChannels,
    );
    expect(actual).toEqual(
      '`[09/10]` voice-channel-1: voice-channel-1-link\n`[01/10]` voice-channel-2: voice-channel-2-link\n`[10/10]` voice-channel-3: voice-channel-3-link\n`[00/10]` voice-channel-4: voice-channel-4-link\n',
    );
  });

  test('printTextChannels()', () => {
    const actual = messageStringService.printTextChannels(textChannels);
    expect(actual).toEqual(
      '**Text Channels:**\n- text-channel-1: `1`\n- text-channel-2: `2`\n',
    );
  });

  test('printVoiceChannels()', () => {
    const actual = messageStringService.printVoiceChannels(voiceChannels);
    expect(actual).toEqual(
      '**Voice Channels:**\n- voice-channel-1: `1`\n- voice-channel-2: `2`\n- voice-channel-3: `3`\n- voice-channel-4: `4`\n',
    );
  });
});
