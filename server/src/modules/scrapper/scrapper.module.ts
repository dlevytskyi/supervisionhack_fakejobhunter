import { Module } from '@nestjs/common';
import { ScrapperService } from './services/scrapper.service';
import { HttpModule } from '@nestjs/axios';
import { ScrapperController } from './controllers/scrapper.controller';
import { OfferModule } from '../offer/offer.module';

@Module({
  imports: [HttpModule, OfferModule],
  controllers: [ScrapperController],
  providers: [ScrapperService],
  exports: [ScrapperService],
})
export class ScrapperModule {}
