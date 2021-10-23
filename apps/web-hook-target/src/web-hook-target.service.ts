import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

const CACHE_KEY = 'stat';

@Injectable()
export class WebHookTargetService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getAccessLog(): Promise<string[]> {
    const log = await this.cacheManager.get<string[]>(CACHE_KEY);

    return log || [];
  }

  async trackAccess(id: string) {
    const log = await this.getAccessLog();
    log.push(id);
    await this.cacheManager.set(CACHE_KEY, log, { ttl: 1000 });
  }
}
