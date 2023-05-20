import { Injectable, NotFoundException } from '@nestjs/common';
import { Offer } from '../entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UuidString } from '@/common/types/shared-types';

@Injectable()
export class OfferService {
  constructor(@InjectRepository(Offer) private repo: Repository<Offer>) {}

  async create(
    title: string,
    date: Date,
    url: string,
    content: string,
    processing_status: string,
    login?: string,
  ): Promise<Offer> {
    const offer = this.repo.create({
      title: title,
      date: date,
      url: url,
      login: login ? login : null,
      content: JSON.parse(content),
      processing_status: processing_status,
    });

    return await this.repo.save(offer);
  }

  async update(id: UuidString, attrs: Partial<Offer>): Promise<Offer> {
    const offer = await this.repo.findOneBy({ id: id });
    if (!offer) {
      throw new NotFoundException('offer not found');
    }
    Object.assign(offer, attrs);
    return await this.repo.save(offer);
  }

  async findOne(id: UuidString): Promise<Offer> {
    const offer = await this.repo.findOneBy({ id: id });
    if (!offer) {
      throw new NotFoundException('offer not found');
    }
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return await this.repo.find();
  }

  async list(
    page: number,
    limit: number,
  ): Promise<{ data: Offer[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.repo.findAndCount({
      skip,
      take: limit,
    });
    return { data, total };
  }
}
