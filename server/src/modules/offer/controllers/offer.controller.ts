import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OfferService } from '../sevices/offer.service';
import { Offer } from '../entities/offer.entity';
import { OfferListQuery } from './queries/offer-list.query';
import { ProcessingStatus } from '../enums/processing-status.enum';
import { CreateOfferCommand } from '../commands/create-offer.command';

@Controller()
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Get('/offers')
  async getOffers(
    @Query() query: OfferListQuery,
  ): Promise<{ data: Offer[]; total: number }> {
    return await this.offerService.list(query.page, query.limit);
  }

  @Post('/offer')
  async createOffer(@Body() body: CreateOfferCommand): Promise<Offer> {
    return await this.offerService.create(
      body.title,
      new Date(),
      body.url,
      body.content,
      ProcessingStatus.NEW,
    );
  }
}
