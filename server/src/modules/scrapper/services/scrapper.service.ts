import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { lastValueFrom } from 'rxjs';
import puppeteer from 'puppeteer';
import * as htmlToText from 'html-to-text';

@Injectable()
export class ScrapperService {
  constructor(private readonly httpService: HttpService) {}

  public async scrappOlxJobsOfferLinks(pageNumber: number) {
    const url = 'https://www.olx.pl/praca/';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const paginationForward = await page.waitForSelector(
      '::-p-xpath(//a[@data-cy="pagination-forward"])',
    );

    const offerLinks = [];
    let currentPage = 1;
    while (currentPage <= pageNumber) {
      console.log('Getting offer links from page number:', currentPage);
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
    await browser.close();
    return offerLinks;
  }

  public async scrappOlxJobOffer(url: string) {
    console.log('Scrapping job offer from url:', url);
    const browser = await puppeteer.launch();
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
    return { offerTitleValue, offerDescriptionText };
  }

  
}
