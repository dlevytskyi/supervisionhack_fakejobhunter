import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapperModule } from './modules/scrapper/scrapper.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { config } from 'ormconfig';
import { OfferModule } from './modules/offer/offer.module';

@Module({
  imports: [
    ScrapperModule,
    TypeOrmModule.forRoot(config),
    OfferModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
