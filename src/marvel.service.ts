import { Character } from './model/character.model';
import { MarvelApiService } from './marvel.api.service';
import { Cache } from 'cache-manager';
import { Logger, Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';

export const ALL_CHARACTER_IDS_KEY = "ALL_CHARACTER_IDS";
export const ALL_CHARACTERS_KEY = "ALL_CHARACTERS";

const TIME_TO_LIVE = 86400;

@Injectable()
export class MarvelService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private marvelApiService: MarvelApiService) {}

  private readonly logger = new Logger(MarvelService.name);
  
  async getCharacterById(id: number): Promise<Character> {
    const map = await this.cacheManager.get(ALL_CHARACTERS_KEY);
    if (!map || !map[id]) {
      this.logger.log('Fetching from api...');
      const allCharacters = await this.marvelApiService.getAllCharacters();
      await this.setInCache(allCharacters);
      return allCharacters.find(item => item.id == id);
    }
    return map[id];
  }

  async getAllCharacterIds(): Promise<number[]> {
    const characterIds: number[] = await this.cacheManager.get<Array<number>>(ALL_CHARACTER_IDS_KEY);
    if (!characterIds || characterIds.length == 0) {
      this.logger.log('Fetching from api...');
      const allCharacters = await this.marvelApiService.getAllCharacters();
      const allIds: number[] = allCharacters.map(item => item.id);
      await this.setInCacheForBothKeys(allIds, allCharacters);
      return allIds;
    }
    return characterIds;
  }

  private async setInCache(allCharacters: Character[]) {
    const allIds: number[] = allCharacters.map(item => item.id);
    await this.setInCacheForBothKeys(allIds, allCharacters);
  }

  private async setInCacheForBothKeys(allIds: number[], allCharacters: Character[]) {
    this.logger.log('Setting in cache...');
    await this.cacheManager.set(ALL_CHARACTER_IDS_KEY, allIds, { ttl: TIME_TO_LIVE });
    const map = allCharacters.reduce((map, obj) => {
      map[obj.id] = obj;
      return map;
    }, {});
    await this.cacheManager.set(ALL_CHARACTERS_KEY, map, { ttl: TIME_TO_LIVE });
  }
}