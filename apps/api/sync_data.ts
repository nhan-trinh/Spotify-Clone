import 'dotenv/config';
import { SearchService } from './src/modules/search/search.service';
import { prisma } from './src/shared/config/database';
import { initMeiliSearch } from './src/shared/config/meilisearch';

async function main() {
  console.log('🔄 Đang khởi tạo Meilisearch...');
  await initMeiliSearch();
  
  console.log('🔄 Đang bắt đầu đồng bộ toàn bộ dữ liệu...');
  const result = await SearchService.syncIndexes();
  console.log('✅ Kết quả:', result.message);
  
  await prisma.$disconnect();
  process.exit(0);
}

main().catch(async (e) => {
  console.error('❌ Lỗi đồng bộ:', e);
  await prisma.$disconnect();
  process.exit(1);
});
