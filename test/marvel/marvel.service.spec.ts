import { Character } from './../../src/marvel/model/character.model';
import { MarvelService } from './../../src/marvel/marvel.service';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';

jest.setTimeout(200000);

describe('MarvelServiceTest', () => {
    let marvelService: MarvelService;

    beforeAll(async () => {
        const testingModule = await Test.createTestingModule({
            imports: [HttpModule.register({
                timeout: 10000,
                maxRedirects: 5,
              })],
            providers: [MarvelService],
        }).compile();
        marvelService = testingModule.get<MarvelService>(MarvelService);
    });

    it('calls multiple times', async () => {
        process.env.PRIVATE_API_KEY = "gibberish";
        process.env.PUBLIC_API_KEY = "gibberish";
        const result: Character[] = await marvelService.getAllCharacters();
        expect(result.length).toBeGreaterThan(100);
    });
})