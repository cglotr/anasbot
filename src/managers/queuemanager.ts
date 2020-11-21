import { QueueSubmission } from '../types/queuesubmission';

export interface QueueManager {
  addUserToQueue(userId: string, channelId: string): void;
  solveQueue(): QueueSubmission[];
}
