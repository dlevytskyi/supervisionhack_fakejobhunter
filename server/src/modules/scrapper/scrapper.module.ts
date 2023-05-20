import { Module } from '@nestjs/common';
import { ScrapperService } from './services/scrapper.service';

@Module({
  providers: [ScrapperService],
})
export class ScrapperModule {}
