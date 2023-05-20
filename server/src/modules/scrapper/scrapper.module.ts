import { Module } from '@nestjs/common';
import { ScrapperService } from './services/scrapper.service';
import { ScrapperController } from './controllers/app.controller';

@Module({
  controllers: [ScrapperController],
  providers: [ScrapperService],
})
export class ScrapperModule {}
