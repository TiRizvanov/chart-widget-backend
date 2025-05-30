import { IsString, IsOptional, IsObject, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DrawingStyleDto {
  @IsString()
  @IsOptional()
  color?: string;

  @IsOptional()
  @IsString()
  lineStyle?: 'solid' | 'dashed' | 'dotted';

  @IsOptional()
  lineWidth?: number;

  @IsOptional()
  @IsString()
  fillColor?: string;

  @IsOptional()
  fontSize?: number;

  @IsOptional()
  @IsString()
  text?: string;
}

class DrawingDataDto {
  @ValidateNested({ each: true })
  @Type(() => DrawingPointDto)
  points: DrawingPointDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => DrawingStyleDto)
  style?: DrawingStyleDto;

  @IsOptional()
  @IsBoolean()
  locked?: boolean;
}

class DrawingPointDto {
  x: number;
  y: number;
  
  @IsOptional()
  timestamp?: number;
}

export class CreateDrawingDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DrawingDataDto)
  data: DrawingDataDto;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;
}
