import { Module } from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferProcessingMetrics } from './entities/offer-processing-metrics.entity';
import { OfferService } from './sevices/offer.service';
import { OfferController } from './controllers/offer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, OfferProcessingMetrics])],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
