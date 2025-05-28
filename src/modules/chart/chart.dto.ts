import { IsString, IsEnum, IsOptional, IsObject, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChartDto {
  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsEnum(['line', 'candlestick'])
  chartType: 'line' | 'candlestick';

  @IsString()
  timeframe: string;

  @IsOptional()
  @IsObject()
  settings?: any;
}

export class UpdateChartDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['line', 'candlestick'])
  chartType?: 'line' | 'candlestick';

  @IsOptional()
  @IsString()
  timeframe?: string;

  @IsOptional()
  @IsObject()
  settings?: any;
}

class DrawingCoordinatesDto {
  @IsNumber()
  startTime: number;

  @IsNumber()
  startPrice: number;

  @IsOptional()
  @IsNumber()
  endTime?: number;

  @IsOptional()
  @IsNumber()
  endPrice?: number;
}

class DrawingStyleDto {
  @IsString()
  color: string;

  @IsNumber()
  lineWidth: number;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  lineStyle?: 'solid' | 'dashed' | 'dotted';

  @IsOptional()
  @IsString()
  fillColor?: string;
}

export class CreateDrawingDto {
  @IsEnum(['trendline', 'horizontal', 'vertical', 'rectangle', 'text'])
  type: 'trendline' | 'horizontal' | 'vertical' | 'rectangle' | 'text';

  @ValidateNested()
  @Type(() => DrawingCoordinatesDto)
  coordinates: DrawingCoordinatesDto;

  @ValidateNested()
  @Type(() => DrawingStyleDto)
  style: DrawingStyleDto;
}

export class UpdateDrawingDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DrawingCoordinatesDto)
  coordinates?: DrawingCoordinatesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DrawingStyleDto)
  style?: DrawingStyleDto;

  @IsOptional()
  @IsString()
  type?: 'trendline' | 'horizontal' | 'vertical' | 'rectangle' | 'text';
}

class IndicatorParametersDto {
  @IsOptional()
  @IsNumber()
  period?: number;

  @IsOptional()
  @IsNumber()
  period2?: number;

  @IsOptional()
  @IsNumber()
  period3?: number;

  @IsOptional()
  @IsNumber()
  deviation?: number;

  @IsOptional()
  @IsString()
  source?: 'close' | 'open' | 'high' | 'low' | 'hl2' | 'hlc3' | 'ohlc4';

  @IsOptional()
  @IsNumber()
  fastPeriod?: number;

  @IsOptional()
  @IsNumber()
  slowPeriod?: number;

  @IsOptional()
  @IsNumber()
  signalPeriod?: number;

  @IsOptional()
  @IsNumber()
  kPeriod?: number;

  @IsOptional()
  @IsNumber()
  dPeriod?: number;

  @IsOptional()
  @IsNumber()
  smooth?: number;
}

class IndicatorStyleDto {
  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  @IsNumber()
  lineWidth?: number;

  @IsOptional()
  @IsNumber()
  opacity?: number;

  @IsOptional()
  @IsString()
  showInLegend?: boolean;
}

export class CreateIndicatorDto {
  @IsEnum(['SMA', 'EMA', 'RSI', 'MACD', 'BOLLINGER', 'VOLUME', 'STOCHASTIC', 'ATR'])
  type: 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'BOLLINGER' | 'VOLUME' | 'STOCHASTIC' | 'ATR';

  @ValidateNested()
  @Type(() => IndicatorParametersDto)
  parameters: IndicatorParametersDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => IndicatorStyleDto)
  style?: IndicatorStyleDto;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateIndicatorDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => IndicatorParametersDto)
  parameters?: IndicatorParametersDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => IndicatorStyleDto)
  style?: IndicatorStyleDto;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @IsOptional()
  @IsString()
  visible?: boolean;
}