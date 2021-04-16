import { HttpModule, Module } from "@nestjs/common";
import { MarvelApiService } from "./marvel.api.service";

@Module({
    imports: [ HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
      }),],
    providers: [MarvelApiService],
  })
  export class MarvelModule {}