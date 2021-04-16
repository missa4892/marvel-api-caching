import { of } from 'rxjs';
import { HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Character } from '../../src/marvel/model/character.model';
import { MarvelApiService } from '../../src/marvel/marvel.api.service';
import { Test } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';

jest.setTimeout(200000);

describe('MarvelServiceTest', () => {
    let marvelApiService: MarvelApiService;
    let mockHttpService: HttpService;

    beforeAll(async () => {
        const testingModule = await Test.createTestingModule({
            imports: [HttpModule.register({
                timeout: 10000,
                maxRedirects: 5,
              })],
            providers: [MarvelApiService],
        }).compile();
        marvelApiService = testingModule.get<MarvelApiService>(MarvelApiService);
        mockHttpService = testingModule.get<HttpService>(HttpService);
    });

    it('returns response of api', async () => {

        const mock: AxiosResponse = {
            data: {data: {results: [{id: 123, name: "123"}], total: 1}},
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {}
          };
        jest.spyOn(mockHttpService, 'get').mockImplementation(() => of(mock));
        const result: Character[] = await marvelApiService.getAllCharacters();
        expect(result).toHaveLength(1);
        expect(result[0].id).toEqual(123);
    });

    it('handles multiple result response of api', async () => {

        const mock: AxiosResponse = {
            data: {data: {results: [{id: 123, name: "123"}, {id: 124, name: "123"}], total: 2}},
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {}
          };
        jest.spyOn(mockHttpService, 'get').mockImplementation(() => of(mock));
        const result: Character[] = await marvelApiService.getAllCharacters();
        expect(result).toHaveLength(2);
        expect(result[0].id).toEqual(123);
        expect(result[1].id).toEqual(124);
    });
})