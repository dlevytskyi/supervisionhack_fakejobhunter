import { Module } from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferAnaliticsResult } from './entities/offer-analitics-result.entity';
import { OfferProcessingMetrics } from './entities/offer-processing-metrics.entity';
import { OfferService } from './sevices/offer.service';
import { OfferController } from './controllers/offer.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Offer,
      OfferAnaliticsResult,
      OfferProcessingMetrics,
    ]),
  ],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
