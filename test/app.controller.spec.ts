import { Character } from './../src/model/character.model';
import { MarvelModule } from '../src/marvel.module';
import { AppController } from '../src/app.controller';
import { Test } from '@nestjs/testing';
import { MarvelService } from '../src/marvel.service';

describe('MarvelController', () => {
  let marvelController: AppController;
  let marvelService: MarvelService;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [MarvelModule],
      controllers: [AppController],
    }).compile();

    marvelController = testingModule.get<AppController>(AppController);
    marvelService = testingModule.get<MarvelService>(MarvelService);
  });

  it('should return character ids', async () => {
    const result = [123, 234, 345];
    jest.spyOn(marvelService, 'getAllCharacterIds').mockResolvedValue(result);
    expect(await marvelController.getCharacters()).toEqual([123, 234, 345]);
  });

  it('should return character by id', async () => {
    const character: Character = {
      id: 123,
      name: '123',
      description: '123 description',
    };
    jest.spyOn(marvelService, 'getCharacterById').mockResolvedValue(character);
    expect(await marvelController.getCharacterById({ id: 123 })).toEqual(
      character,
    );
  });
});
