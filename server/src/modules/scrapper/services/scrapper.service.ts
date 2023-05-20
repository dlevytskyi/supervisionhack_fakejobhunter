import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as htmlToText from 'html-to-text';
import * as cheerio from 'cheerio';

export interface IOffer {
  title: string;
  scrappingDate: Date;
  url: string;
  content: string;
}

@Injectable()
export class ScrapperService {
  constructor(private readonly httpService: HttpService) {}
  private browser: puppeteer.Browser | null = null;

  private startBrowser = async () => {
    if (!this.browser) {
      this.browser = await puppeteer.launch();
    }
  };

  private closeBrowser = async () => {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  };

  private async scrapeOlxJobsOfferLinks(pageNumber: number) {
    const url = 'https://www.olx.pl/praca/';
    const browser = this.browser;
    const page = await browser.newPage();
    await page.goto(url);

    const offerLinks = [];
    let currentPage = 1;
    while (currentPage <= pageNumber) {
      console.log('Getting offer links from page', page.url() + currentPage);
      const paginationForward = await page.waitForSelector(
        '::-p-xpath(//a[@data-cy="pagination-forward"])',
      );
      try {
        offerLinks.push(
          ...(await page.evaluate(() => {
            const linksArray = [];
            document.querySelectorAll('a').forEach((el) => {
              if (el.href.includes('olx.pl/oferta/praca')) {
                linksArray.push(el.href);
              }
            });
            return linksArray;
          })),
        );
      } catch (error) {
        console.error('Error scraping job offers:', error);
      }
      currentPage++;
      await paginationForward.click();
    }
    return offerLinks;
  }

  private async scrapeOlxJobOffer(url: string): Promise<IOffer> {
    try {
      console.log('Scrapping job offer from url:', url);
      const browser = this.browser;
      const page = await browser.newPage();
      await page.goto(url);

      const offerTitleElement = await page.waitForSelector('::-p-xpath(//h1)');
      const offerTitleValue = await offerTitleElement.evaluate(
        (el) => el.textContent,
      );

      const offerDescriptionElement = await page.waitForSelector(
        '::-p-xpath(//div/h2/..)',
      );
      const offerDescriptionHtml = await offerDescriptionElement.evaluate(
        (el) => el.innerHTML,
      );
      const offerDescriptionText = htmlToText.convert(offerDescriptionHtml);
      page.close();
      return {
        title: offerTitleValue,
        content: offerDescriptionText,
        url: url,
        scrappingDate: new Date(),
      };
    } catch (error) {
      console.error(`Error scrapping job offer from url ${url}:`, error);
    }
  }

  public async scrapeOlxJobOffers(): Promise<IOffer[]> {
    await this.startBrowser();
    const offerLinks = new Array(
      ...new Set(
        await this.scrapeOlxJobsOfferLinks(
          Number(process.env.OLX_SCRAPPING_PAGE_LIMIT),
        ),
      ),
    );

    let jobOffers = [];

    //Scrapping 10 offers at a time
    for (let i = 0; i < offerLinks.length; i++) {
      const tenOfferLinks = offerLinks.slice(i, i + 10);
      i += 10;
      await Promise.all(
        tenOfferLinks.map((offerLink) => this.scrapeOlxJobOffer(offerLink)),
      ).then((values) => {
        jobOffers = [...jobOffers, ...values];
      });
    }
    await this.closeBrowser();
    return jobOffers;
  }

  private async scrapeOglaszamy24JobsOfferLinks(pageNumber: number) {
    const BASE_URL = 'https://www.oglaszamy24.pl';
    const browser = this.browser;
    const page = await browser.newPage();
    await page.goto(BASE_URL + '/ogloszenia/praca/oferty-pracy/', {
      waitUntil: 'domcontentloaded',
    });

    const offerLinks = [];
    let currentPage = 1;
    while (currentPage <= pageNumber) {
      console.log('Getting offer links from page', page.url());
      const $ = cheerio.load(await page.content());
      $('a.o_title').each((index, element) => {
        offerLinks.push($(element).attr('href').trim());
      });
      currentPage++;
      const paginationForwardUrl = `/ogloszenia/praca/oferty-pracy/?std=1&results=${currentPage}`;
      await page.goto(BASE_URL + paginationForwardUrl, {
        waitUntil: 'domcontentloaded',
      });
    }
    return offerLinks;
  }

  private async scrapeOglaszamy24JobOffer(url: string): Promise<IOffer> {
    try {
      console.log('Scrapping job offer from url:', url);
      const browser = this.browser;
      const page = await browser.newPage();
      await page.goto(url);
      const offerTitleElement = await page.waitForSelector('::-p-xpath(//h1)');
      const offerTitleValue = await offerTitleElement.evaluate(
        (el) => el.textContent,
      );
      const offerDescriptionElement = await page.waitForSelector('#adv_desc');
      const offerDescriptionHtml = await offerDescriptionElement.evaluate(
        (el) => el.innerHTML,
      );
      const offerDescriptionText = htmlToText.convert(offerDescriptionHtml);
      page.close();
      return {
        title: offerTitleValue,
        content: offerDescriptionText,
        url: url,
        scrappingDate: new Date(),
      };
    } catch (error) {
      console.error(`Error scraping job offers from ${url}:`, error);
    }
  }

  public async scrapeOglaszamy24JobOffers(): Promise<IOffer[]> {
    await this.startBrowser();
    const offerLinks = new Array(
      ...new Set(
        await this.scrapeOglaszamy24JobsOfferLinks(
          Number(process.env.OGLASZAMY24_SCRAPPING_PAGE_LIMIT),
        ),
      ),
    );
    let jobOffers = [];

    //Scrapping 10 offers at a time
    for (let i = 0; i < offerLinks.length; i++) {
      const tenOfferLinks = offerLinks.slice(i, i + 10);
      i += 10;
      await Promise.all(
        tenOfferLinks.map((offerLink) =>
          this.scrapeOglaszamy24JobOffer(offerLink),
        ),
      ).then((values) => {
        jobOffers = [...jobOffers, ...values];
      });
    }
    await this.closeBrowser();
    return jobOffers;
  }

  private async scrapeSprzedajemyJobsOfferLinks(pageNumber: number) {
    const BASE_URL = 'https://sprzedajemy.pl';
    const browser = this.browser;
    const page = await browser.newPage();
    await page.goto(BASE_URL + '/praca', {
      waitUntil: 'domcontentloaded',
    });

    const offerLinks = [];
    let currentPage = 1;
    while (currentPage <= pageNumber) {
      console.log('Getting offer links from page', page.url());
      const $ = cheerio.load(await page.content());
      $('a.offerLink').each((index, element) => {
        const link = BASE_URL + $(element).attr('href').trim();
        if (offerLinks[offerLinks.length - 1] !== link) {
          offerLinks.push(link);
        }
      });
      const paginationForwardUrl = `/praca/?offset=${30 * currentPage}`;
      currentPage++;
      await page.goto(BASE_URL + paginationForwardUrl, {
        waitUntil: 'domcontentloaded',
      });
    }
    return offerLinks;
  }

  private async scrapeSprzedajemyJobOffer(url: string): Promise<IOffer> {
    try {
      console.log('Scrapping job offer from url:', url);
      const browser = this.browser;
      const page = await browser.newPage();
      await page.goto(url);
      const offerTitleElement = await page.waitForSelector('.isUrgentTitle');
      const offerTitleValue = await offerTitleElement.evaluate(
        (el) => el.textContent,
      );
      const offerDescriptionElement = await page.waitForSelector(
        '.offerDescription span',
      );
      const offerDescriptionHtml = await offerDescriptionElement.evaluate(
        (el) => el.innerHTML,
      );
      const offerDescriptionText = htmlToText.convert(offerDescriptionHtml);
      page.close();
      return {
        title: offerTitleValue,
        content: offerDescriptionText,
        url: url,
        scrappingDate: new Date(),
      };
    } catch (error) {
      console.error(`Error scraping job offers from ${url}:`, error);
    }
  }

  public async scrapeSprzedajemyJobOffers(): Promise<IOffer[]> {
    await this.startBrowser();
    const offerLinks = new Array(
      ...new Set(
        await this.scrapeSprzedajemyJobsOfferLinks(
          Number(process.env.SPRZEDAJEMY_SCRAPPING_PAGE_LIMIT),
        ),
      ),
    );
    let jobOffers = [];

    //Scrapping 10 offers at a time
    for (let i = 0; i < offerLinks.length; i++) {
      const tenOfferLinks = offerLinks.slice(i, i + 10);
      i += 10;
      await Promise.all(
        tenOfferLinks.map((offerLink) =>
          this.scrapeSprzedajemyJobOffer(offerLink),
        ),
      ).then((values) => {
        jobOffers = [...jobOffers, ...values];
      });
    }
    await this.closeBrowser();
    return jobOffers;
  }
}
