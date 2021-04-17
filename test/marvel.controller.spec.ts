import { MarvelModule } from '../src/marvel.module';
import { MarvelApiService } from './../src/marvel.api.service';
import { AppController } from './../src/app.controller';
import { Test } from '@nestjs/testing';
import { MarvelService } from '../src/marvel.service';

describe('MarvelController', () => {
  let marvelController: AppController;
  let marvelService: MarvelService;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [MarvelModule],
      controllers: [AppController]
    }).compile();

    marvelController = testingModule.get<AppController>(AppController);
    marvelService = testingModule.get<MarvelService>(MarvelService);
  });

    it('should return character ids', async () => {
        const result = [123, 234, 345];
        jest.spyOn(marvelService, 'getAllCharacterIds').mockResolvedValue(result);
        expect(await marvelController.getCharacters()).toEqual([123, 234, 345]);
    });
});
