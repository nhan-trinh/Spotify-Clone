import { Queue } from 'bullmq';
import { redis } from '../config/redis';

// Định nghĩa các loại Job
export enum JobType {
  PROCESS_AUDIO = 'process_audio',
  PROCESS_VIDEO = 'process_video',
}

export interface MediaJobData {
  songId: string;
  originalUrl: string;
  artistId: string;
  type: 'AUDIO' | 'VIDEO';
}

// Khởi tạo Queue "media-processing"
// BullMQ tự động dùng Redis đã config (đảm bảo maxRetriesPerRequest: null)
export const mediaQueue = new Queue('media-processing', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const QueueService = {
  /**
   * Thêm job xử lý âm thanh (128k + 320k)
   */
  addAudioJob: async (data: MediaJobData) => {
    return await mediaQueue.add(JobType.PROCESS_AUDIO, data, {
      priority: 10, // Ưu tiên xử lý nhạc
    });
  },

  /**
   * Thêm job xử lý video canvas
   */
  addVideoJob: async (data: MediaJobData) => {
    return await mediaQueue.add(JobType.PROCESS_VIDEO, data, {
      priority: 20, // Video xử lý sau nhạc xíu
    });
  },
};
