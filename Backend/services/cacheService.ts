import { createClient } from 'redis';

class CacheService {
  private client: any;
  private isConnected: boolean = false;
  private fallbackMap: Map<string, { value: any; expiry: number }> = new Map();

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.client.on('error', (err: any) => {
      console.warn('[Cache] Redis Error / Not Connected. Using in-memory fallback.');
      this.isConnected = false;
    });

    this.client.connect().then(() => {
      console.log('[Cache] Redis Connected successfully.');
      this.isConnected = true;
    }).catch(() => {
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
