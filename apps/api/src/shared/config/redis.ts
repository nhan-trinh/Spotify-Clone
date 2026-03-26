import Redis from 'ioredis';
import { env } from './env';

// Singleton Redis client dùng chung toàn app
// Dùng cho: cache, session, token blacklist, BullMQ
export const redis = new Redis(env.REDIS_URL, {
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null, // Yêu cầu của BullMQ
});

redis.on('connect', () => {
  console.log('✅ Redis đã kết nối');
});

redis.on('error', (err: Error) => {
  console.error('❌ Redis lỗi:', err.message);
});
