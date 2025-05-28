import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSeederController } from './data-seeder.controller';
import { ChartData } from '../../entities/chart-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChartData])],
  controllers: [DataSeederController],
})
export class DataSeederModule {}