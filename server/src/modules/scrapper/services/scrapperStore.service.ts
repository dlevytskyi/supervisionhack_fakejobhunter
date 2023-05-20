import { OfferService } from '@/modules/offer/sevices/offer.service';
import { Injectable } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { ProcessingStatus } from '@/modules/offer/enums/processingStatus.enum';

@Injectable()
export class ScrapperStoreService {
  constructor(
    private offerService: OfferService,
    private scrapperService: ScrapperService,
  ) {}

  public async scrapeAndStoreOffers() {
    const olxOffers = await this.scrapperService.scrapeOlxJobOffers();
    const oglaszamy24Offers =
      await this.scrapperService.scrapeOglaszamy24JobOffers();
    const sprzedajemyOffers =
      await this.scrapperService.scrapeSprzedajemyJobOffers();

    const offers = [...olxOffers, ...oglaszamy24Offers, ...sprzedajemyOffers];
    console.log('offers', offers);
    offers.forEach(async (offer) => {
      try {
        const offerExists = await this.offerService.findOneByUrl(offer.url);

        if (!offerExists) {
          await this.offerService.create(
            offer.title,
            offer.scrappingDate,
            offer.url,
            JSON.stringify({ content: offer.content }),
            ProcessingStatus.NEW,
          );
          console.log('offers saved to DB successfully');
        }
      } catch (error) {
        console.log('error', error);
      }
    });
  }
}
