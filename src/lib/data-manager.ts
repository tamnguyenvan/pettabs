import { openDB, DBSchema } from 'idb';
import { WORKER_URL, OFFLINE_FALLBACK_IMAGE, OFFLINE_FALLBACK_DATA } from './constants';
import { getUserId } from './user';
import { 
    Soundscape, 
    DailyContentRecord as DBDailyContentRecord 
} from '../types';

// Re-export the type for backward compatibility
export type DailyContentRecord = DBDailyContentRecord;

// Interface cho soundscapes cache
interface SoundscapesCache {
  id: 'soundscapes_cache';
  soundscapes: Soundscape[];
  lastUpdated: string; // ISO date string
}

// DB Schema
interface PetTabsDB extends DBSchema {
  daily_content: {
    key: string;
    value: DailyContentRecord;
  };
  soundscapes: {
    key: string;
    value: SoundscapesCache;
  };
}

const DB_NAME = 'PetTabsCacheDB';
const DB_VERSION = 3; // Incremented version for schema changes

const dbPromise = openDB<PetTabsDB>(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    // Create object stores if they don't exist
    if (!db.objectStoreNames.contains('daily_content')) {
      db.createObjectStore('daily_content', { keyPath: 'date' });
    }
    
    // Add soundscapes store in version 3
    if (oldVersion < 3) {
      db.createObjectStore('soundscapes', { keyPath: 'id' });
    }
  },
});

/**
 * Lấy nội dung cho ngày hôm nay.
 * Nếu không có trong cache, nó sẽ fetch dữ liệu cho cả hôm nay và ngày mai,
 * lưu vào cache, và dọn dẹp cache cũ.
 */
// Soundscapes cache TTL in milliseconds (24 hours)
const SOUNDSCAPES_CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Fetches soundscapes from cache or network
 * @returns Array of soundscapes
 */
export async function getSoundscapes(): Promise<Soundscape[]> {
  const db = await dbPromise;
  
  try {
    // Try to get from cache first
    const cache = await db.get('soundscapes', 'soundscapes_cache');
    const now = new Date();
    
    // Return cached soundscapes if they're still fresh
    if (cache && (now.getTime() - new Date(cache.lastUpdated).getTime() < SOUNDSCAPES_CACHE_TTL)) {
      console.log('Using cached soundscapes');
      return cache.soundscapes;
    }
    
    // If we're offline and have no cache, return empty array
    if (!navigator.onLine) {
      console.log('Offline with no cached soundscapes');
      return [];
    }
    
    // Fetch fresh soundscapes from the network
    console.log('Fetching fresh soundscapes from network');
    const response = await fetch(`${WORKER_URL}/api/soundscapes`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch soundscapes: ${response.statusText}`);
    }
    
    const soundscapes = await response.json();
    
    // Update cache
    const cacheEntry: SoundscapesCache = {
      id: 'soundscapes_cache',
      soundscapes,
      lastUpdated: new Date().toISOString(),
    };
    
    await db.put('soundscapes', cacheEntry);
    return soundscapes;
    
  } catch (error) {
    console.error('Error in getSoundscapes:', error);
    
    // If we have stale data, return it even if it's expired
    const staleCache = await db.get('soundscapes', 'soundscapes_cache');
    if (staleCache?.soundscapes?.length) {
      console.log('Using stale soundscapes from cache');
      return staleCache.soundscapes;
    }
    
    return [];
  }
}

export async function getOrFetchContent(category: string) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const db = await dbPromise;

    // 1. Luôn kiểm tra cache trước
    const cachedToday = await db.get('daily_content', todayStr);
    if (cachedToday && cachedToday.category === category) {
        console.log('Cache hit for today!');
        return {
            ...cachedToday,
            imageUrl: URL.createObjectURL(cachedToday.imageBlob),
            source: 'cache',
        };
    }

    // 2. Nếu không có cache -> Fetch từ network
    if (navigator.onLine) {
        try {
            console.log("Cache miss. Fetching content for today and tomorrow...");
            const userId = getUserId();
            const response = await fetch(`${WORKER_URL}/api/daily-content?userId=${userId}&category=${category}`);
            if (!response.ok) throw new Error('Failed to fetch from worker');
            
            const data = await response.json();
            const { today: todayData, tomorrow: tomorrowData } = data;
            
            if (!todayData || !tomorrowData) throw new Error('Incomplete data from server');

            // Tải song song 2 ảnh blob
            const [todayImageBlob, tomorrowImageBlob] = await Promise.all([
                fetch(`${WORKER_URL}${todayData.image.url_path}`).then(res => res.blob()),
                fetch(`${WORKER_URL}${tomorrowData.image.url_path}`).then(res => res.blob())
            ]);
            
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().slice(0, 10);

            const todayRecord: DailyContentRecord = { date: todayStr, category, imageBlob: todayImageBlob, ...todayData };
            const tomorrowRecord: DailyContentRecord = { date: tomorrowStr, category, imageBlob: tomorrowImageBlob, ...tomorrowData };

            // Dọn dẹp cache cũ (chỉ giữ lại hôm nay và ngày mai)
            const allKeys = await db.getAllKeys('daily_content');
            const keysToDelete = allKeys.filter(key => key !== todayStr && key !== tomorrowStr);
            
            // Thực hiện tất cả các thao tác DB trong một transaction
            const tx = db.transaction('daily_content', 'readwrite');
            
            // Thực hiện các thao tác put/delete trong transaction
            await tx.store.put(todayRecord);
            await tx.store.put(tomorrowRecord);
            
            // Xóa các key cũ nếu có
            const deletePromises = keysToDelete.map(key => tx.store.delete(key));
            await Promise.all(deletePromises);
            
            await tx.done;

            console.log("Successfully fetched and cached content for today and tomorrow. Old cache cleared.");

            // Trả về dữ liệu của ngày hôm nay
            return {
                ...todayRecord,
                imageUrl: URL.createObjectURL(todayRecord.imageBlob),
                source: 'network',
            };

        } catch (error) {
            console.error("Failed to fetch/cache content:", error);
        }
    }
    
    // 3. Fallback cuối cùng
    console.log("Using offline fallback.");
    return {
        imageUrl: OFFLINE_FALLBACK_IMAGE,
        ...OFFLINE_FALLBACK_DATA,
        source: 'fallback',
    };
}