import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapperModule } from './modules/scrapper/scrapper.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ScrapperModule,
    TypeOrmModule.forRoot(ormconfig),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
