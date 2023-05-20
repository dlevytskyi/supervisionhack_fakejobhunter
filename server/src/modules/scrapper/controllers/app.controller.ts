import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ScrapperService } from '@/modules/scrapper/services/scrapper.service';

@Controller()
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Get()
  getHello(): string {
    //return this.scrapperService.getHello();
    return;
  }
  @Post('/hello')
  postHello(@Param('id') id: string, @Body() json: string): string {
    //return this.scrapperService.getHello();
    console.log(name);
    console.log(json);
    return;
  }
}
