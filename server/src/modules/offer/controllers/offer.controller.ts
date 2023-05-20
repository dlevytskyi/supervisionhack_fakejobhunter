import { Controller, Get, Query } from '@nestjs/common';
import { OfferService } from '../sevices/offer.service';
import { Offer } from '../entities/offer.entity';
import { OfferListQuery } from './queries/offer-list.query';

@Controller()
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Get('/offers')
  async getOffers(
    @Query() query: OfferListQuery,
  ): Promise<{ data: Offer[]; total: number }> {
    return await this.offerService.list(query.page, query.limit);
  }
}
