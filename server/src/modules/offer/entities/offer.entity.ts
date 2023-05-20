import { UuidString } from '@/common/types/shared-types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OfferProcessingMetrics } from './offer-processing-metrics.entity';
import { OfferAnaliticsResult } from './offer-analitics-result.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('offers.offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id!: UuidString;

  @Column()
  title!: string;

  @Column()
  date!: Date;

  @Column()
  url!: string;

  @Column()
  login!: string;

  @Column()
  content!: string;

  @Column()
  processing_status!: string;

  @OneToOne(
    () => OfferProcessingMetrics,
    (x: OfferProcessingMetrics) => x.offer_id,
  )
  @JoinColumn({ referencedColumnName: 'id', name: 'id' })
  offerProcessingMetrics!: OfferProcessingMetrics;

  @OneToOne(() => OfferAnaliticsResult, (x: OfferAnaliticsResult) => x.offer_id)
  @JoinColumn({ referencedColumnName: 'id', name: 'id' })
  offerAnaliticsResult!: OfferAnaliticsResult;

  constructor() {
    this.id = uuidv4();
  }
}
