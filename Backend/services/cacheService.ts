import { createClient } from 'redis';

class CacheService {
  private client: any;
  private isConnected: boolean = false;
  private fallbackMap: Map<string, { value: any; expiry: number }> = new Map();

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      console.log('[Cache] No Redis URL provided. Using in-memory cache.');
      this.isConnected = false;
      return;
    }

    this.client = createClient({
      url: redisUrl
    });

    this.client.on('error', (err: any) => {
      // Only log if it's not a connection failure when we're already expecting to fail
      if (this.isConnected) {
        console.warn('[Cache] Redis Connection Lost. Falling back to memory.');
      }
      this.isConnected = false;
    });

    this.client.connect().then(() => {
      console.log('[Cache] Redis Connected successfully.');
      this.isConnected = true;
    }).catch(() => {
      console.warn('[Cache] Redis Connection Failed. Using in-memory fallback.');
      this.isConnected = false;
    });
  }

  async get(key: string) {
    if (this.isConnected) {
      const val = await this.client.get(key);
      return val ? JSON.parse(val) : null;
    }
    
    // Fallback logic
    const item = this.fallbackMap.get(key);
    if (item && item.expiry > Date.now()) {
      return item.value;
    }
    return null;
  }

  async set(key: string, value: any, expirySeconds: number = 3600) {
    if (this.isConnected) {
      await this.client.set(key, JSON.stringify(value), {
        EX: expirySeconds
      });
    } else {
      this.fallbackMap.set(key, {
        value,
        expiry: Date.now() + (expirySeconds * 1000)
      });
    }
  }

  async del(key: string) {
    if (this.isConnected) {
      await this.client.del(key);
    } else {
      this.fallbackMap.delete(key);
    }
  }

  async clearPattern(pattern: string) {
    if (this.isConnected) {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) await this.client.del(keys);
    } else {
      // Simple pattern clear for fallback
      for (const key of this.fallbackMap.keys()) {
        if (key.includes(pattern.replace('*', ''))) {
          this.fallbackMap.delete(key);
        }
      }
    }
  }
}

export default new CacheService();
