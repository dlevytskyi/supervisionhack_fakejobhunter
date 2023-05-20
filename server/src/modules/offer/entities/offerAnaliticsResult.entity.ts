import { UuidString } from '@/common/types/shared-types';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Offer } from './offer.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class OfferAnaliticsResult {
  @PrimaryGeneratedColumn('uuid')
  id!: UuidString;

  @Column()
  offer_id!: UuidString;

  @Column()
  decision!: string;

  @OneToOne(() => Offer, (x: Offer) => x.offerProcessingMetrics)
  @JoinColumn({ referencedColumnName: 'id', name: 'offer_id' })
  offer!: Offer;

  constructor() {
    this.id = uuidv4();
  }
}
