import mongoose from 'mongoose';
import { env } from './env';

// Kết nối MongoDB (Mongoose)
// Dùng cho: listening_history, notifications, recently_played
export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ MongoDB đã kết nối');
  } catch (error) {
    console.error('❌ MongoDB lỗi kết nối:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB mất kết nối');
});
