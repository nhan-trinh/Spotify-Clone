import { Worker, Job } from 'bullmq';
import { redis } from '../shared/config/redis';
import { MediaJobData } from '../shared/services/queue.service';
import { MediaProcessor } from '../shared/utils/media-processor.util';
import { prisma } from '../shared/config/database';

/**
 * Worker xử lý các tiến trình tốn thời gian (Transcoding)
 */
export const mediaWorker = new Worker('media-processing', async (job: Job<MediaJobData>) => {
  const { songId, originalUrl, artistId, type } = job.data;
  console.log(`[Worker] ✨ Bắt đầu xử lý Job ${job.id}: ${type} cho bài hát ${songId}`);

  let localPath = '';
  try {
    // 1. Tải tệp gốc về local
    localPath = await MediaProcessor.downloadToTemp(originalUrl, `${Date.now()}_original_${songId}`);

    if (type === 'AUDIO') {
      // 2. Xử lý Audio (320k + 128k)
      const urls = await MediaProcessor.processAudio(localPath, artistId, songId);

      // 3. Cập nhật URL đã xử lý và chuyển sang trạng thái Chờ duyệt (PENDING)
      await prisma.song.update({
        where: { id: songId },
        data: {
          audioUrl128: urls.url128,
          audioUrl320: urls.url320,
          status: 'PENDING', // Chuyển sang PENDING để Admin duyệt bài
        }
      });
      console.log(`[Worker] ✅ Đã xử lý xong Audio cho ${songId}`);
    } 
    else if (type === 'VIDEO') {
      // 2. Xử lý Video Canvas
      const optimizedUrl = await MediaProcessor.processVideoCanvas(localPath, artistId, songId);

      // 3. Cập nhật Canvas URL mới
      await prisma.song.update({
        where: { id: songId },
        data: {
          canvasUrl: optimizedUrl,
        }
      });
      console.log(`[Worker] ✅ Đã xử lý xong Video Canvas cho ${songId}`);
    }

  } catch (error: any) {
    console.error(`[Worker] ❌ Lỗi xử lý Job ${job.id}:`, error.message);
    
    // Cập nhật trạng thái thất bại vào DB để Artist biết
    try {
      if (songId) {
        await prisma.song.update({
          where: { id: songId },
          data: { 
            status: 'FAILED',
            statusReason: error.message || 'TECHNICAL_PROCESSING_ERROR'
          }
        });
      }
    } catch (dbErr) {
      console.error('[Worker] Không thể cập nhật trạng thái lỗi vào DB:', dbErr);
    }

    throw error; // Ném ra để BullMQ thực hiện retry (maxAttempts = 3)
  } finally {
    // 4. Dọn dẹp tệp tạm
    if (localPath) MediaProcessor.cleanup(localPath);
  }
}, {
  connection: redis,
  concurrency: 2, // Chỉ cho phép xử lý 2 job đồng thời trên mỗi worker để tránh nghẽn CPU (FFmpeg tốn tài nguyên)
});

mediaWorker.on('completed', (job) => {
  console.log(`[Worker] 🏆 Job ${job.id} đã hoàn thành thành công!`);
});

mediaWorker.on('failed', (job, err) => {
  console.error(`[Worker] 💀 Job ${job?.id} thất bại sau các lần thử:`, err.message);
});
