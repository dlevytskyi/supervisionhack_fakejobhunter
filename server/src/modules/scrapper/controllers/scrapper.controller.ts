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
    return await this.offerService.findAll();
  }

  @Get('/olxOffers')
  getOlxOffers() {
    return this.scrapperService.scrapeOlxJobOffers();
  }

  @Get('/oglaszamy24Offers')
  getOglaszamy24Offers() {
    return this.scrapperService.scrapeOglaszamy24JobOffers();
  }

  @Get('/sprzedajemyOffers')
  getSprzedajemyOffers() {
    return this.scrapperService.scrapeSprzedajemyJobOffers();
  }
}
