export interface SyncedLyricLine {
  time: number; // in seconds
  text: string;
}

export function parseLRC(lrcText: string): SyncedLyricLine[] {
  if (!lrcText) return [];

  const lines = lrcText.split('\n');
  const result: SyncedLyricLine[] = [];
  for (const line of lines) {
    const timeRegex = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?\]/g;
    const timeMatches = [];
    let match;
    // Tìm tất cả các thẻ thời gian trong 1 dòng (VD: [00:15.30][00:18.20] Hello)
    while ((match = timeRegex.exec(line)) !== null) {
      timeMatches.push(match);
    }

    if (timeMatches.length > 0) {
      // Dọn dẹp thẻ thời gian để lấy Text
      const text = line.replace(timeRegex, '').trim();
      
      // Bỏ qua dòng trống nếu không có chữ (tùy chọn)
      // if (!text) continue; 
      
      for (const tMatch of timeMatches) {
        const minutes = parseInt(tMatch[1], 10);
        const seconds = parseInt(tMatch[2], 10);
        let milliseconds = 0;
        
        if (tMatch[3]) {
          let msStr = tMatch[3];
          if (msStr.length === 2) msStr += '0';
          milliseconds = parseInt(msStr, 10);
        }

        const timeInSeconds = minutes * 60 + seconds + milliseconds / 1000;
        result.push({
          time: timeInSeconds,
          text
        });
      }
    }
  }

  // Sắp xếp lại theo cục thời gian
  return result.sort((a, b) => a.time - b.time);
}
