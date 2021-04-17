import { Controller, Get } from '@nestjs/common';
import { MarvelService } from './marvel.service';

@Controller()
export class AppController {
  constructor(private readonly marvelService: MarvelService) {}

  @Get('/characters')
  getCharacters(): Promise<number[]> {
    return this.marvelService.getAllCharacterIds();
  }
}
