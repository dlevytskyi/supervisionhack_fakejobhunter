import { IsNotEmpty } from 'class-validator';

export class CreateOfferCommand {
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  url!: string;

  @IsNotEmpty()
  content!: string;
}
