// Advanced Caching Strategy
// Comprehensive caching solution for improved performance

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items
  strategy: 'lru' | 'fifo' | 'lfu'; // Cache eviction strategy
  persistent: boolean; // Whether to persist to localStorage
}

export interface CacheItem<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  evictions: number;
}

class AdvancedCache<T> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private config: CacheConfig;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0,
    evictions: 0
  };
  private storageKey: string;

  constructor(config: CacheConfig, storageKey?: string) {
    this.config = config;
    this.storageKey = storageKey || 'cache';
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (!this.config.persistent || typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(data.cache || []);
        this.stats = data.stats || this.stats;
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  private saveToStorage() {
    if (!this.config.persistent || typeof window === 'undefined') return;

    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        stats: this.stats
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  private isExpired(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp > this.config.ttl;
  }

  private evictItem(): void {
    if (this.cache.size === 0) return;

    let keyToEvict: string | null = null;

    switch (this.config.strategy) {
      case 'lru':
        // Least Recently Used
        keyToEvict = Array.from(this.cache.entries())
          .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)[0][0];
        break;
      
      case 'fifo':
        // First In, First Out
        keyToEvict = this.cache.keys().next().value;
        break;
      
      case 'lfu':
        // Least Frequently Used
        keyToEvict = Array.from(this.cache.entries())
          .sort((a, b) => a[1].accessCount - b[1].accessCount)[0][0];
        break;
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
      this.stats.evictions++;
    }
  }

  private updateStats(hit: boolean): void {
    if (hit) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }
    
    this.stats.size = this.cache.size;
    this.stats.hitRate = this.stats.hits / (this.stats.hits + this.stats.misses);
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.updateStats(false);
      return null;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      this.updateStats(false);
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = Date.now();
    this.updateStats(true);
    
    return item.value;
  }

  set(key: string, value: T): void {
    // Check if we need to evict items
    while (this.cache.size >= this.config.maxSize) {
      this.evictItem();
    }

    const item: CacheItem<T> = {
      value,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now()
    };

    this.cache.set(key, item);
    this.updateStats(false);
    this.saveToStorage();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item || this.isExpired(item)) {
      if (item) this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      hitRate: 0,
      evictions: 0
    };
    this.saveToStorage();
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  getSize(): number {
    return this.cache.size;
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.config.ttl) {
        this.cache.delete(key);
      }
    }
    this.saveToStorage();
  }
}

// API Response Cache
export const apiCache = new AdvancedCache<any>({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  strategy: 'lru',
  persistent: true
}, 'api_cache');

// Image Cache
export const imageCache = new AdvancedCache<string>({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 50,
  strategy: 'lru',
  persistent: false
}, 'image_cache');

// User Data Cache
export const userCache = new AdvancedCache<any>({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 20,
  strategy: 'lru',
  persistent: true
}, 'user_cache');

// Search Results Cache
export const searchCache = new AdvancedCache<any>({
  ttl: 2 * 60 * 1000, // 2 minutes
  maxSize: 30,
  strategy: 'lru',
  persistent: false
}, 'search_cache');

// Cache Management Utilities
export class CacheManager {
  private caches: Map<string, AdvancedCache<any>> = new Map();

  registerCache<T>(name: string, cache: AdvancedCache<T>): void {
    this.caches.set(name, cache);
  }

  getCache<T>(name: string): AdvancedCache<T> | undefined {
    return this.caches.get(name);
  }

  clearAll(): void {
    this.caches.forEach(cache => cache.clear());
  }

  cleanupAll(): void {
    this.caches.forEach(cache => cache.cleanup());
  }

  getStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    this.caches.forEach((cache, name) => {
      stats[name] = cache.getStats();
    });
    return stats;
  }

  // Auto-cleanup every 5 minutes
  startAutoCleanup(): void {
    setInterval(() => {
      this.cleanupAll();
    }, 5 * 60 * 1000);
  }
}

// Singleton cache manager
export const cacheManager = new CacheManager();

// Register default caches
cacheManager.registerCache('api', apiCache);
cacheManager.registerCache('image', imageCache);
cacheManager.registerCache('user', userCache);
cacheManager.registerCache('search', searchCache);

// Start auto-cleanup
if (typeof window !== 'undefined') {
  cacheManager.startAutoCleanup();
}

// Cache Decorator for Functions
export function cached<T extends (...args: any[]) => any>(
  cache: AdvancedCache<ReturnType<T>>,
  keyGenerator?: (...args: Parameters<T>) => string
) {
  return function (fn: T): T {
    return ((...args: Parameters<T>) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      const cached = cache.get(key);
      
      if (cached !== null) {
        return cached;
      }
      
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }) as T;
  };
}

// Cache Hooks for React
export function useCache<T>(cache: AdvancedCache<T>, key: string, fetcher: () => T): T {
  const [value, setValue] = React.useState<T | null>(() => cache.get(key));
  
  React.useEffect(() => {
    if (value === null) {
      const result = fetcher();
      cache.set(key, result);
      setValue(result);
    }
  }, [key, cache, fetcher, value]);
  
  return value as T;
}

export default AdvancedCache;
