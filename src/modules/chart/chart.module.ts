import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';
import { Chart } from '../../entities/chart.entity';
import { Drawing } from '../../entities/drawing.entity';
import { Indicator } from '../../entities/indicator.entity';
import { ChartData } from '../../entities/chart-data.entity';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chart, Drawing, Indicator, ChartData]),
    WebSocketModule,
  ],
  controllers: [ChartController],
  providers: [ChartService],
  exports: [ChartService],
})
export class ChartModule {}
