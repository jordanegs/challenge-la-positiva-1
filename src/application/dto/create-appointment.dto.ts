import { IsString, IsNumber, IsIn, Length, IsOptional } from 'class-validator';

export class CreateInsuredDto {
  @IsString()
  @Length(5, 5)
  insuredId: string;

  @IsNumber()
  scheduleId: number;

  @IsString()
  @IsIn(['PE', 'CL'])
  countryISO: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}
