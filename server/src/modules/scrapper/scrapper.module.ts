import { Module } from '@nestjs/common';
import { ScrapperService } from './services/scrapper.service';
import { HttpModule } from '@nestjs/axios';
import { ScrapperController } from './controllers/scrapper.controller';
import { OfferModule } from '../offer/offer.module';
import { ScrapperStoreService } from './services/scrapper-store.service';

@Module({
  imports: [HttpModule, OfferModule],
  controllers: [ScrapperController],
  providers: [ScrapperService, ScrapperStoreService],
  exports: [ScrapperService],
})
export class ScrapperModule {}
