import { IsString, IsOptional, IsObject, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class IndicatorParametersDto {
  @IsOptional()
  period?: number;

  @IsOptional()
  fastPeriod?: number;

  @IsOptional()
  slowPeriod?: number;

  @IsOptional()
  signalPeriod?: number;

  @IsOptional()
  source?: string;

  @IsOptional()
  @IsObject()
  additionalParams?: Record<string, any>;
}

class IndicatorStyleDto {
  @IsString()
  @IsOptional()
  color?: string;

  @IsOptional()
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  lineWidth?: number;

  @IsOptional()
  opacity?: number;

  @IsOptional()
  @IsBoolean()
  showInLegend?: boolean;
}

export class CreateIndicatorDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsEnum(['SMA', 'EMA', 'RSI', 'MACD', 'Bollinger', 'Volume', 'VWAP'], {
    message: 'Type must be one of: SMA, EMA, RSI, MACD, Bollinger, Volume, VWAP',
  })
  type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => IndicatorParametersDto)
  parameters: IndicatorParametersDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => IndicatorStyleDto)
  style?: IndicatorStyleDto;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  displayOrder?: number;
}
