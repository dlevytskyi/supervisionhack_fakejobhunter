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

  @Get('/test')
  getHello(): string {
    //return this.scrapperService.getHello();
    return;
  }
  @Post('/hello/:id')
  postHello(
    @Param('id') id: string,
    @Query('name') name: string,
    @Body() json: string,
  ): string {
    //return this.scrapperService.getHello()
    // http://localhost:3000/hello/33221?name=asd
    console.log(id);
    console.log(name);
    console.log(json);
    return;
  }

  @Get('/olxOffers')
  getOlxOffers() {
    return this.scrapperService.scrappOlxJobsOfferLinks(10);
  }

  @Get('/scrappOlxJobOffer')
  getScrappedOlxJobOffer(@Query('url') url: string) {
    return this.scrapperService.scrappOlxJobOffer(url);
  }
}
