import { QueueSubmission } from '../types/queuesubmission';

export interface QueueManager {
  addUserToQueue(queueSubmission: QueueSubmission): void;
  solveQueue(): QueueSubmission[];
}
