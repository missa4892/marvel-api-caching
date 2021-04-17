import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MarvelService } from './marvel.service';
import { AppController } from './app.controller';
import { MarvelModule } from './marvel.module';

@Module({
  imports: [MarvelModule, CacheModule.register(), ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [MarvelService],
})
export class AppModule {}
