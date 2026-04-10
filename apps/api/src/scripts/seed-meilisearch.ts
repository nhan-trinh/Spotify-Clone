import 'dotenv/config';
import { SearchService } from '../modules/search/search.service';
import { prisma } from '../shared/config/database';
import { meilisearch } from '../shared/config/meilisearch';

async function main() {
  console.log('🚀 Đang bắt đầu đồng bộ Meilisearch...');
  
  try {
    // 1. Kiểm tra kết nối Meilisearch
    const health = await meilisearch.health();
    console.log('✅ Meilisearch Status:', health.status);

    // 2. Chạy logic đồng bộ
    const result = await SearchService.syncIndexes();
    console.log(`✨ ${result.message}`);
    
  } catch (error) {
    console.error('❌ Lỗi khi đồng bộ Meilisearch:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
