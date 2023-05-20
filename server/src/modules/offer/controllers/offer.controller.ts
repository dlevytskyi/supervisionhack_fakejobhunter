import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OfferService } from '../sevices/offer.service';
import { Offer } from '../entities/offer.entity';
import { OfferListQuery } from './queries/offer-list.query';
import { ProcessingStatus } from '../enums/processing-status.enum';
import { CreateOfferCommand } from '../commands/create-offer.command';
import { UpdateOfferAnalystDecisionCommand } from '../commands/update-offer-analyst-status.command';
import { UuidString } from '@/common/types/shared-types';

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

  @Post('/offers/:id/decision')
  async updateOfferAnalystDecision(
    @Param('id') id: UuidString,
    @Body() body: UpdateOfferAnalystDecisionCommand,
  ): Promise<Offer> {
    return await this.offerService.update(id, {
      analyst_decision: body.decision,
    });
  }
}
