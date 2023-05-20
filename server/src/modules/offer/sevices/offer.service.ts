import { Injectable } from '@nestjs/common';
import { Offer } from '../entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OfferService {
  constructor(@InjectRepository(Offer) private repo: Repository<Offer>) {}

  async create() {
    const offer = this.repo.create({
      title: 'test',
      date: new Date(),
      url: 'test',
      login: 'test',
      content: JSON.parse(`{
        "statusCode": 500,
        "message": "Internal server error"
        }`),
      processing_status: 'test',
    });

    return await this.repo.save(offer);
  }
}
