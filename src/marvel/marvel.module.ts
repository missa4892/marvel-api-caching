import { HttpModule, Module } from "@nestjs/common";
import { MarvelService } from "./marvel.service";

@Module({
    imports: [ HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
      }),],
    providers: [MarvelService],
  })
  export class MarvelModule {}