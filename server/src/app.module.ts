import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapperModule } from './modules/scrapper/scrapper.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';

@Module({
  imports: [ScrapperModule, TypeOrmModule.forRoot(ormconfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
