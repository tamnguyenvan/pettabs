import { openDB, DBSchema } from 'idb';
import { WORKER_URL, OFFLINE_FALLBACK } from './constants';
import { getUserId } from './user';
import { Attribution, FactData } from '../types';

// Interface cho nội dung trả về
export interface DailyContentPayload {
  image: {
    url: string;
    attribution: Attribution;
  } | null;
  fact: FactData | null;
}

// Interface cho dữ liệu lưu trong DB
interface DailyContentRecord {
  date: string; // "YYYY-MM-DD"
  category: string;
  image: {
    url: string;
    attribution: Attribution;
  };
  fact: FactData;
}

// Schema của DB
interface PetTabsDB extends DBSchema {
  daily_content: {
    key: string; // Sẽ là "YYYY-MM-DD"
    value: DailyContentRecord;
  };
}

const DB_NAME = 'PetTabsDB';
const DB_VERSION = 1; // Tăng version vì thay đổi cấu trúc

const dbPromise = openDB<PetTabsDB>(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    if (!db.objectStoreNames.contains('daily_content')) {
      db.createObjectStore('daily_content', { keyPath: 'date' });
    }
  },
});


/**
 * Hàm chính để lấy nội dung hàng ngày, xử lý cả online và offline.
 * @param category - The category of content to fetch ('cat', 'dog', etc.)
 */
export async function getDailyContent(category: string): Promise<DailyContentPayload> {
  const isOnline = navigator.onLine;
  const today = new Date().toISOString().slice(0, 10);
  const db = await dbPromise;

  // --- LOGIC KHI CÓ MẠNG ---
  if (isOnline) {
    // 1. Kiểm tra cache cho ngày hôm nay
    const cachedTodayContent = await db.get('daily_content', today);
    if (cachedTodayContent && cachedTodayContent.category === category) {
      console.log("Online: Found today's content in cache.");
      return cachedTodayContent; // Trả về ngay
    }

    // 2. Nếu không có cache, fetch từ worker
    console.log("Online: Fetching new content from worker.");
    try {
      const userId = getUserId();
      const response = await fetch(`${WORKER_URL}/api/daily-content?userId=${userId}&category=${category}`);
      if (!response.ok) throw new Error('Failed to fetch from worker');

      const data = await response.json();
      console.log('data', data)
      
      // Đảm bảo dữ liệu nhận về có cấu trúc đúng
      if (data.image && data.fact) {
        const dailyData: DailyContentRecord = { date: today, category, ...data };
        // Cập nhật cache
        await db.put('daily_content', dailyData);
        return dailyData;
      } else {
        throw new Error("Incomplete data received from worker.");
      }
    } catch (error) {
      console.error("Online: Fetch failed, using fallback.", error);
      // Nếu fetch lỗi, rơi xuống logic offline
    }
  }

  // --- LOGIC KHI MẤT MẠNG (hoặc fetch online bị lỗi) ---
  console.log("Offline: Attempting to find cached content.");

  // 1. Lấy bản ghi gần nhất từ cache
  const cursor = await db.transaction('daily_content').store.openCursor(null, 'prev');
  if (cursor) {
    console.log("Offline: Found most recent cached content.");
    return cursor.value; // Trả về dữ liệu gần nhất tìm được
  }
  
  // 2. Nếu cache hoàn toàn trống, trả về dữ liệu mặc định
  console.log("Offline: No cache found, using hardcoded fallback.");
  return OFFLINE_FALLBACK;
}