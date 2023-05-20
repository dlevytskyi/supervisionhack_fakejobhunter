import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ScrapperService } from '@/modules/scrapper/services/scrapper.service';
import { OfferService } from '@/modules/offer/sevices/offer.service';

@Controller()
export class ScrapperController {
  constructor(
    private readonly scrapperService: ScrapperService,
    private readonly offerService: OfferService,
  ) {}

  @Get('/offers')
  async getOffers(): Promise<any> {
    return await this.offerService.create();
  }

  @Get('/olxOffers')
  getOlxOffers() {
    return this.scrapperService.scrappOlxJobOffers();
  }

  @Get('/oglaszamy24plOffers')
  getOglaszamy24Offers() {
    return this.scrapperService.scrappOglaszamy24JobOffers();
  }

}
