import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOffersStructure1684591658013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create schema offers;

        create table offers.offers
        (
            id          uuid                      not null constraint offers_pk primary key,
            title       varchar                   not null,
            date        timestamptz               not null,
            url         varchar                   not null,
            login       varchar                 default null,
            content     json                    not null,
            processing_status varchar           not null
        );

        create unique index offer_id_and_processing_status
        on offers.offers (id, processing_status);

        create table offers.offer_processing_metrics
        (
            id                  uuid           not null constraint offers_processing_metrics_pk primary key,
            offer_id            uuid           not null,
            ration              varchar        not null
        );

        alter table offers.offer_processing_metrics add constraint offer_processing_metrics_offer_id_fk
        foreign key (offer_id)
        references offers.offers (id);

        create table offers.offer_analitics_decision
        (
            id                  uuid           not null constraint offer_analitics_decisions_pk primary key,
            offer_id            uuid           not null,
            decision            varchar        not null
        );

        alter table offers.offer_analitics_decision add constraint offer_analitics_decision_offer_id_fk
        foreign key (offer_id)
        references offers.offers (id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop schema offers cascade;`);
  }
}
