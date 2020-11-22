import { LoggerServiceImpl } from '../services/loggerserviceimpl';
import { VoiceChannelService } from '../services/voicechannelservice';
import { QueueSubmission } from '../types/queuesubmission';
import { VoiceChannel } from '../types/voicechannel';
import { QueueManager } from './queuemanager';
import { QueueManagerImpl } from './queuemanagerimpl';

describe('QueueManagerImpl', () => {
  let queueManager: QueueManager;
  let voiceChannelService: VoiceChannelService;
  let fullVoiceChannel: VoiceChannel;
  let nonFullVoiceChannel: VoiceChannel;
  let emptyVoiceChannel: VoiceChannel;
  let fullChannelQueueSubmission: QueueSubmission;
  let nonFullChannelQueueSubmission: QueueSubmission;
  let emptyChannelQueueSubmission: QueueSubmission;

  beforeEach(() => {
    fullVoiceChannel = {
      id: 'full-voice-channel-id',
      name: 'full-voice-channel-name',
      userCount: 10,
      userLimit: 10,
      link: 'full-voice-channel-link',
      position: 0,
    };
    nonFullVoiceChannel = {
      id: 'nonfull-voice-channel-id',
      name: 'nonfull-voice-channel-name',
      userCount: 5,
      userLimit: 10,
      link: 'nonfull-voice-channel-link',
      position: 1,
    };
    emptyVoiceChannel = {
      id: 'empty-voice-channel-id',
      name: 'empty-voice-channel',
      userCount: 0,
      userLimit: 5,
      link: 'empty-voice-channel-link',
      position: 2,
    };
    voiceChannelService = {
      add: jest.fn(),
      list: jest.fn(() => {
        return [fullVoiceChannel, nonFullVoiceChannel, emptyVoiceChannel];
      }),
      updateUserCount: jest.fn(),
      remove: jest.fn(),
    };
    queueManager = new QueueManagerImpl(
      new LoggerServiceImpl(),
      voiceChannelService,
    );
    fullChannelQueueSubmission = {
      userId: 'test-user-id',
      channelId: 'full-voice-channel-id',
    };
    nonFullChannelQueueSubmission = {
      userId: 'test-user-id',
      channelId: 'nonfull-voice-channel-id',
    };
    emptyChannelQueueSubmission = {
      userId: 'test-user-id',
      channelId: 'empty-voice-channel-id',
    };
  });

  it('asking to queue into a full room', async () => {
    queueManager.addUserToQueue(fullChannelQueueSubmission);
    expect(queueManager.solveQueue()).toStrictEqual([]);
  });

  it('asking to queue into a non-full room', async () => {
    queueManager.addUserToQueue(nonFullChannelQueueSubmission);
    expect(queueManager.solveQueue()).toStrictEqual([
      nonFullChannelQueueSubmission,
    ]);
  });

  it('asking to queue into an empty room', async () => {
    queueManager.addUserToQueue(emptyChannelQueueSubmission);
    expect(queueManager.solveQueue()).toStrictEqual([
      emptyChannelQueueSubmission,
    ]);
  });
});
