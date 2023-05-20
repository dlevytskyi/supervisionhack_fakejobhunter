import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ScrapperService } from '@/modules/scrapper/services/scrapper.service';
import { ScrapperStoreService } from '../services/scrapperStore.service';

@Controller()
export class ScrapperController {
  constructor(
    private readonly scrapperService: ScrapperService,
    private readonly scrapperStoreService: ScrapperStoreService,
  ) {}

  @Get('/offers')
  async getOffers(): Promise<any> {
    return await this.scrapperStoreService.scrapeAndStoreOffers();
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
