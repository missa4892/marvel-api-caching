import {createHash} from 'crypto';
import { AxiosRequestConfig } from 'axios';
import { Character } from './model/character.model';
import { Injectable, HttpService } from "@nestjs/common";

@Injectable()
export class MarvelApiService {
  constructor(private httpService: HttpService) {}

  async getAllCharacters(): Promise<Character[]> {
    const ts = Date.now().toString();
    const hash = createHash('md5')
    .update(ts + process.env.PRIVATE_API_KEY + process.env.PUBLIC_API_KEY)
    .digest('hex');
    
    const resultArr: Character[] = [];
    let total: number = 1000;
    for (let i = 0; i <= total; i += 100) {
        const config: AxiosRequestConfig = {
            params: {
                apikey: process.env.PUBLIC_API_KEY,
                limit: 100,
                offset: i,
                hash,
                ts
            }
        };
        
        const result = await this.httpService.get('https://gateway.marvel.com:443/v1/public/characters', config).toPromise().then(response => {
            total = response.data?.data?.total || 0;
            return response.data?.data?.results || [];
        });
        resultArr.push(...result);
    }

    return resultArr.map(currItem => {
      const id = currItem.id;
      const name = currItem.name;
      const description = currItem.description;
      return { id, name, description };
    });
  }
}