import axios from 'axios';

async function testSearch() {
  try {
    const res = await axios.get('http://localhost:3001/api/v1/search?q=blessing');
    console.log('Search Results:', JSON.stringify(res.data, null, 2));
  } catch (error: any) {
    console.error('Error fetching search:', error.message);
  }
}

testSearch();
