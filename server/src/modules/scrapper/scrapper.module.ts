import { Module } from '@nestjs/common';
import { ScrapperService } from './services/scrapper.service';
import { HttpModule } from '@nestjs/axios';
import { ScrapperController } from './controllers/scrapper.controller';

@Module({
  imports: [HttpModule],
  controllers: [ScrapperController],
  providers: [ScrapperService],
})
export class ScrapperModule {}
