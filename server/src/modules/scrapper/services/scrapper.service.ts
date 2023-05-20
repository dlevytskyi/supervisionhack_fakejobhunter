import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as htmlToText from 'html-to-text';
import * as cheerio from 'cheerio';

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

  private async scrappOlxJobsOfferLinks(pageNumber: number) {
    const url = 'https://www.olx.pl/praca/';
    const browser = this.browser;
    const page = await browser.newPage();
    await page.goto(url);

    const offerLinks = [];
    let currentPage = 1;
    while (currentPage <= pageNumber) {
      console.log('Getting offer links from page number:', currentPage);
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

  private async scrappOlxJobOffer(url: string) {
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
      return { offerTitleValue, offerDescriptionText, offerUrl: url };
    } catch (error) {
      console.error(`Error scrapping job offer from url ${url}:`, error);
    }
  }

  public async scrappOlxJobOffers() {
    await this.startBrowser();
    const offerLinks = await this.scrappOlxJobsOfferLinks(
      Number(process.env.OLX_SCRAPPING_PAGE_NUMBER),
    );
    let jobOffers = [];

    //Scrapping 10 offers at a time
    for (let i = 0; i < offerLinks.length; i++) {
      const tenOfferLinks = offerLinks.slice(i, i + 10);
      i += 10;
      await Promise.all(
        tenOfferLinks.map((offerLink) => this.scrappOlxJobOffer(offerLink)),
      ).then((values) => {
        jobOffers = [...jobOffers, ...values];
      });
    }
    await this.closeBrowser();
    return jobOffers;
  }

  private async scrappOglaszamy24JobsOfferLinks(pageNumber: number) {
    const BASE_URL = 'https://www.oglaszamy24.pl';
    const browser = this.browser;
    const page = await browser.newPage();
    await page.goto(BASE_URL + '/ogloszenia/praca/oferty-pracy/', {
      waitUntil: 'domcontentloaded',
    });

    const offerLinks = [];
    let currentPage = 1;
    while (currentPage <= pageNumber) {
      console.log('Getting offer links from page number:', currentPage);
      const $ = cheerio.load(await page.content());
      const paginationForwardUrl = $('.resultpages.next')
        .children('a')
        .attr('href')
        .trim();
      $('a.o_title').each((index, element) => {
        offerLinks.push($(element).attr('href').trim());
      });

      currentPage++;
      await page.goto(BASE_URL + paginationForwardUrl, {
        waitUntil: 'domcontentloaded',
      });
    }
    return offerLinks;
  }

  private async scrappOglaszamy24JobOffer(url: string) {
    try {
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
      return { offerTitleValue, offerDescriptionText, offerUrl: url };
    } catch (error) {
      console.error(`Error scraping job offers from ${url}:`, error);
      return {};
    }
  }

  public async scrappOglaszamy24JobOffers() {
    await this.startBrowser();
    const offerLinks = await this.scrappOglaszamy24JobsOfferLinks(
      Number(process.env.OGLASZAMY24_SCRAPPING_PAGE_NUMBER),
    );
    let jobOffers = [];

    //Scrapping 10 offers at a time
    for (let i = 0; i < offerLinks.length; i++) {
      const tenOfferLinks = offerLinks.slice(i, i + 10);
      i += 10;
      await Promise.all(
        tenOfferLinks.map((offerLink) =>
          this.scrappOglaszamy24JobOffer(offerLink),
        ),
      ).then((values) => {
        jobOffers = [...jobOffers, ...values];
      });
    }
    await this.closeBrowser();
    return jobOffers;
  }
}
