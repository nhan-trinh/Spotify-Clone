import axios from 'axios';

async function forceSync() {
  try {
    // Giả sử có route /search/sync (cần check router)
    // Nếu không có, ta gọi trực tiếp Service qua một script khác hoặc dùng API nếu đã lộ
    console.log('Đang yêu cầu Sync Meilisearch...');
    const res = await axios.post('http://localhost:3001/api/v1/search/sync');
    console.log('Sync Results:', res.data);
  } catch (error: any) {
    console.error('Error syncing:', error.response?.data || error.message);
  }
}

forceSync();
