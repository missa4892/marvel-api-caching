import { MarvelService } from './marvel.service';
import { HttpModule, Module, CacheModule } from '@nestjs/common';
import { MarvelApiService } from './marvel.api.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.register(),
  ],
  providers: [MarvelApiService, MarvelService],
  exports: [MarvelApiService, MarvelService],
})
export class MarvelModule {}
