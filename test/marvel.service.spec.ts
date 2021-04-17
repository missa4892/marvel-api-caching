import { Cache } from 'cache-manager';
import { Character } from '../src/model/character.model';
import {
  MarvelService,
  ALL_CHARACTER_IDS_KEY,
  ALL_CHARACTERS_KEY,
} from '../src/marvel.service';
import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { MarvelApiService } from '../src/marvel.api.service';
import { Test } from '@nestjs/testing';
import { MarvelModule } from '../src/marvel.module';

describe('MarvelServiceTest', () => {
  let marvelApiService: MarvelApiService;
  let marvelService: MarvelService;
  let cacheManager: Cache;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [CacheModule.register(), MarvelModule],
      providers: [MarvelService],
    }).compile();
    marvelApiService = testingModule.get<MarvelApiService>(MarvelApiService);
    marvelService = testingModule.get<MarvelService>(MarvelService);
    cacheManager = testingModule.get<any>(CACHE_MANAGER);
  });

  describe('getAllCharacters', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
    });
    it('calls api service and sets in cache', async () => {
      const allCharacters: Character[] = [
        { id: 123, name: '123' },
        { id: 124, name: '124' },
      ];
      jest
        .spyOn(marvelApiService, 'getAllCharacters')
        .mockResolvedValue(allCharacters);
      const spyCacheGet = jest.spyOn(cacheManager, 'get');
      const spyCacheSet = jest.spyOn(cacheManager, 'set');
      const result: number[] = await marvelService.getAllCharacterIds();

      expect(spyCacheGet).toHaveBeenCalledWith(ALL_CHARACTER_IDS_KEY);
      expect(spyCacheGet).toHaveBeenCalledTimes(1);
      expect(spyCacheSet).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });

    it('subsequently uses from cache', async () => {
      const spyCacheGet = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue([123, 124, 234]);
      const spyCacheSet = jest.spyOn(cacheManager, 'set');
      const spyMarvelApiService = jest.spyOn(
        marvelApiService,
        'getAllCharacters',
      );
      const result: number[] = await marvelService.getAllCharacterIds();

      expect(spyCacheGet).toHaveBeenCalledWith(ALL_CHARACTER_IDS_KEY);
      expect(spyCacheSet).not.toHaveBeenCalled();
      expect(spyMarvelApiService).not.toHaveBeenCalled();
      expect(result).toHaveLength(3);
    });
  });

  describe('getCharacterById', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
    });
    it('calls api service and sets in cache', async () => {
      const allCharacters: Character[] = [
        { id: 123, name: '123', description: '123 description' },
        { id: 124, name: '124', description: '124 description' },
      ];
      jest
        .spyOn(marvelApiService, 'getAllCharacters')
        .mockResolvedValue(allCharacters);
      const spyCacheGet = jest.spyOn(cacheManager, 'get');
      const spyCacheSet = jest.spyOn(cacheManager, 'set');
      const result: Character = await marvelService.getCharacterById(124);

      expect(spyCacheGet).toHaveBeenCalledWith(ALL_CHARACTERS_KEY);
      expect(spyCacheGet).toHaveBeenCalledTimes(1);
      expect(spyCacheSet).toHaveBeenCalledTimes(2);
      expect(result.id).toBe(124);
      expect(result.name).toBe('124');
      expect(result.description).toBe('124 description');
    });

    it('subsequently uses from cache', async () => {
      const map = {
        123: { id: 123, name: '123', description: '123 description' },
        124: { id: 124, name: '124', description: '124 description' },
        234: { id: 234, name: '234', description: '234 description' },
      };
      const spyCacheGet = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(map);
      const spyCacheSet = jest.spyOn(cacheManager, 'set');
      const spyMarvelApiService = jest.spyOn(
        marvelApiService,
        'getAllCharacters',
      );
      const result: Character = await marvelService.getCharacterById(124);

      expect(spyCacheGet).toHaveBeenCalledWith(ALL_CHARACTERS_KEY);
      expect(spyCacheSet).not.toHaveBeenCalled();
      expect(spyMarvelApiService).not.toHaveBeenCalled();
      expect(result.id).toBe(124);
      expect(result.name).toBe('124');
      expect(result.description).toBe('124 description');
    });

    it('returns empty if id does not exist', async () => {
      const allCharacters: Character[] = [
        { id: 123, name: '123', description: '123 description' },
        { id: 124, name: '124', description: '124 description' },
      ];
      jest
        .spyOn(marvelApiService, 'getAllCharacters')
        .mockResolvedValue(allCharacters);
      const spyCacheGet = jest.spyOn(cacheManager, 'get');
      const spyCacheSet = jest.spyOn(cacheManager, 'set');
      const result: Character = await marvelService.getCharacterById(100000);

      expect(spyCacheGet).toHaveBeenCalledWith(ALL_CHARACTERS_KEY);
      expect(spyCacheGet).toHaveBeenCalledTimes(1);
      expect(spyCacheSet).toHaveBeenCalledTimes(2);
      expect(result).toBeFalsy();
    });
  });
});
