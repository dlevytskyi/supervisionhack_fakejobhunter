import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OfferService } from '../sevices/offer.service';
import { Offer } from '../entities/offer.entity';
import { OfferListQuery } from './queries/offer-list.query';
import { ProcessingStatus } from '../enums/processing-status.enum';
import { CreateOfferCommand } from '../commands/create-offer.command';
import { UpdateOfferAnalystDecisionCommand } from '../commands/update-offer-analyst-status.command';
import { UuidString } from '@/common/types/shared-types';
import * as csvParser from 'csv-parser';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { createReadStream, readFileSync, unlinkSync } from 'fs';
import { Response } from 'express';
import { createObjectCsvWriter } from 'csv-writer';

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

  @Get('/offers/csv')
  async downloadCsv(@Res() res: Response) {
    // Fetch your large dataset
    const dataset = await this.fetchOfferDataset();

    // Set response headers for CSV file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=export.csv');

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: 'export.csv', // Temporarily write to a file
      header: ['id', 'title', 'date', 'url', 'content'], // Specify the column headers
    });

    // Write the header row
    await csvWriter.writeRecords([
      {
        id: 'ID',
        title: 'Title',
        date: 'Date',
        url: 'URL',
        content: 'Content',
      },
    ]);

    // Write the dataset rows
    await csvWriter.writeRecords(dataset);

    // Stream the generated CSV file to the response
    const stream = createReadStream('export.csv');
    stream.pipe(res).on('finish', () => unlinkSync('export.csv'));
  }

  private async fetchOfferDataset() {
    const dataset = await this.offerService.findAll();
    return dataset.map((offer) => {
      return {
        id: offer.id,
        title: offer.title,
        date: offer.date,
        url: offer.url,
        content: JSON.stringify(offer.content),
      };
    });
  }

  @Post('/offers/upload')
  @UseInterceptors(FileInterceptor('csv'))
  async uploadCsv(@UploadedFile() file: any) {
    const fileContent: string = readFileSync('./uploads/' + file.filename, {
      encoding: 'utf-8',
    });
    const results = [];
    (await new Promise((resolve, reject) => {
      const stream = Readable.from(fileContent);

      stream
        .pipe(csvParser())
        .on('data', (data) => {
          const { content, analyst_decision } = data;
          const rowData = {
            title: 'title',
            url: 'url',
            content: content || '',
            analyst_decision: analyst_decision || '',
          };
          results.push(rowData);
        })
        .on('end', async () => {
          resolve(results);
        })
        .on('error', (error) => {
          // Handle any parsing errors
          reject(error);
        });
    })) as any[];

    await results.forEach(async (row) => {
      await this.offerService.create(
        row.title,
        new Date(),
        row.url,
        JSON.stringify({ content: row.content }),
        ProcessingStatus.PROCESSED,
        row.analyst_decision,
      );
    });
  }
}
