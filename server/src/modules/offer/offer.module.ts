import { Module } from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferProcessingMetrics } from './entities/offer-processing-metrics.entity';
import { OfferService } from './sevices/offer.service';
import { OfferController } from './controllers/offer.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer, OfferProcessingMetrics]),
    MulterModule.register({
      dest: './uploads', // Set the destination directory for file uploads
    }),
  ],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
