import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { SupabaseUtil } from './supabase.util';

/**
 * Tiện ích xử lý đa phương tiện (Audio/Video) bằng FFmpeg.
 * Đảm bảo hệ thống đã cài đặt FFmpeg binary trước khi sử dụng.
 */
export const MediaProcessor = {
  /**
   * Tải tệp từ URL về thư mục tạm
   */
  downloadToTemp: async (url: string, filename: string): Promise<string> => {
    const tempDir = path.join(os.tmpdir(), 'spotify-clone-media');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const tempPath = path.join(tempDir, filename);
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(tempPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(tempPath));
      writer.on('error', (err) => {
        writer.close();
        fs.unlink(tempPath, () => {}); // Xóa file lỗi nếu có
        reject(err);
      });
    });
  },

  /**
   * Chuyển đổi âm thanh sang các chuẩn bitrate khác nhau (128k, 320k)
   */
  processAudio: async (inputPath: string, artistId: string, songId: string) => {
    const outputs = [
      { quality: '128', bitrate: '128k' },
      { quality: '320', bitrate: '320k' },
    ];

    const results: Record<string, string> = {};

    for (const out of outputs) {
      const outputFilename = `${songId}_${out.quality}.mp3`;
      const outputPath = path.join(path.dirname(inputPath), outputFilename);

      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .audioBitrate(out.bitrate)
          .toFormat('mp3')
          .on('end', resolve)
          .on('error', reject)
          .save(outputPath);
      });

      // Upload lên Supabase bucket 'audio'
      const remotePath = `processed/${artistId}/${outputFilename}`;
      const buffer = fs.readFileSync(outputPath);
      const publicUrl = await SupabaseUtil.uploadBuffer('audio', remotePath, buffer, 'audio/mpeg');
      
      results[`url${out.quality}`] = publicUrl;

      // Xóa file tạm bitrate vừa tạo
      fs.unlinkSync(outputPath);
    }

    return results;
  },

  /**
   * Tối ưu Video Canvas (Nén về 720p, bitrate thấp cho mobile)
   */
  processVideoCanvas: async (inputPath: string, artistId: string, songId: string) => {
    const outputFilename = `${songId}_optimized.mp4`;
    const outputPath = path.join(path.dirname(inputPath), outputFilename);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoFilters('scale=-2:720') // Fix: Đảm bảo chiều rộng chia hết cho 2 (yêu cầu của libx264)
        .videoCodec('libx264')
        .videoBitrate('1500k')
        .addOption('-crf', '23')
        .addOption('-preset', 'veryfast')
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
    });

    // Upload lên Supabase bucket 'videos'
    const remotePath = `canvases/processed/${artistId}/${outputFilename}`;
    const buffer = fs.readFileSync(outputPath);
    const publicUrl = await SupabaseUtil.uploadBuffer('videos', remotePath, buffer, 'video/mp4');

    // Xóa file tạm video vừa nén
    fs.unlinkSync(outputPath);

    return publicUrl;
  },

  /**
   * Dọn dẹp tệp tạm gốc
   */
  cleanup: (filePath: string) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
