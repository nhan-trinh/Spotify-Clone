import { SearchService } from '../apps/api/src/modules/search/search.service';
import { prisma } from '../apps/api/src/shared/config/database';

async function manualSync() {
  try {
    console.log('Đang đồng bộ trực tiếp qua Database...');
    const result = await SearchService.syncIndexes();
    console.log('Kết quả:', result);
    process.exit(0);
  } catch (error) {
    console.error('Lỗi sync:', error);
    process.exit(1);
  }
}

manualSync();
