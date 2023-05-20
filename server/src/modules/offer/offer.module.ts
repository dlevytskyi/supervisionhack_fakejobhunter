import { Module } from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferAnaliticsResult } from './entities/offerAnaliticsResult.entity';
import { OfferProcessingMetrics } from './entities/offerProcessingMetrics.entity';
import { OfferService } from './sevices/offer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Offer,
      OfferAnaliticsResult,
      OfferProcessingMetrics,
    ]),
  ],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
