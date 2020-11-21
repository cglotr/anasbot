import { LoggerService } from '../services/loggerservice';
import { VoiceChannelService } from '../services/voicechannelservice';
import { QueueSubmission } from '../types/queuesubmission';
import { QueueManager } from './queuemanager';

export class QueueManagerImpl implements QueueManager {
  private loggerService: LoggerService;

  private voiceChannelService: VoiceChannelService;

  private channelQueue: Map<string, string[]>;

  constructor(
    loggerService: LoggerService,
    voiceChannelService: VoiceChannelService,
  ) {
    this.loggerService = loggerService;
    this.voiceChannelService = voiceChannelService;
    this.channelQueue = new Map();
  }

  public addUserToQueue(userId: string, channelId: string): void {
    this.loggerService.info(
      `Attempting to add userId:${userId} to queue for channelId:${channelId}`,
    );
    const queue = this.channelQueue.get(channelId);
    if (!queue) {
      this.loggerService.info(
        `Create a queue for the room with channelId:${channelId} with user with userId:${userId} as its first queuer`,
      );
      this.channelQueue.set(channelId, [userId]);
    } else {
      const user = queue.find((id) => id === userId);
      if (user) {
        this.loggerService.info(
          `The user with userId:${userId} already queued for channel with channelId:${channelId}`,
        );
      } else {
        this.loggerService.info(
          `Added user with userId:${userId} into the channel with channelId:${channelId}`,
        );
        queue.push(userId);
      }
    }
  }

  // SAFETY: This will only work if we maintain the invariant that queue contains unique IDs.
  public removeUserFromQueue(userId: string, channelId: string): void {
    this.loggerService.info(
      `Attempting to remove userId:${userId} from the queue for channelId:${channelId}`,
    );
    const queue = this.channelQueue.get(channelId);
    if (!queue) {
      this.loggerService.info(
        `The channel with channelId:${channelId} does not exist`,
      );
    } else {
      const user = queue.find((id) => id === userId);
      if (user) {
        this.loggerService.info(
          `Removed user with userId:${userId} from channel with channelId:${channelId}`,
        );
        this.channelQueue.set(
          channelId,
          queue.filter((id) => id !== userId),
        );
      } else {
        this.loggerService.info(
          `The user with userId:${userId} does not exist in the channel with channelId:${channelId}`,
        );
      }
    }
  }

  public solveQueue(): QueueSubmission[] {
    const result: QueueSubmission[] = [];
    this.voiceChannelService.list().forEach((channel) => {
      const usersQueueing = this.channelQueue.get(channel.id);
      if (usersQueueing) {
        // Basically clamps between 0 <= x <= (min(slots, queue.length))
        const slotLeft = Math.max(
          0,
          Math.min(channel.userLimit - channel.userCount, usersQueueing.length),
        );
        this.loggerService.info(
          `There are ${slotLeft} slots left for channel with channelId:${channel.id}`,
        );
        for (let a = 0; a < slotLeft; a += 1) {
          // SAFETY: We have already checked the bounds before.
          const userId = usersQueueing.shift() as string;
          result.push({
            userId,
            channelId: channel.id,
          });
        }
      } else {
        this.loggerService.info(
          `No one queued for channel with channeldId:${channel.id}`,
        );
      }
    });
    return result;
  }
}
