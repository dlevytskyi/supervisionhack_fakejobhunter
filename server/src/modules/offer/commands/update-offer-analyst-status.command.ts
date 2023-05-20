import { IsEnum, IsNotEmpty } from 'class-validator';
import { AnalystDecision } from '../enums/analyst-decision.enum';

export class UpdateOfferAnalystDecisionCommand {
  @IsEnum(AnalystDecision)
  @IsNotEmpty()
  decision!: AnalystDecision;
}
