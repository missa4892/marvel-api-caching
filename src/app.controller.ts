import { Character } from './model/character.model';
import { Controller, Get, Param } from '@nestjs/common';
import { MarvelService } from './marvel.service';
import { CharacterParam } from './model/character.param';

@Controller()
export class AppController {
  constructor(private readonly marvelService: MarvelService) {}

  @Get('/characters')
  getCharacters(): Promise<number[]> {
    return this.marvelService.getAllCharacterIds();
  }

  @Get('/characters/:id')
  getCharacterById(@Param() params: CharacterParam): Promise<Character> {
    return this.marvelService.getCharacterById(params.id);
  }
}
