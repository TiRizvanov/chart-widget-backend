import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Logger } from '@nestjs/common';
import { ChartService } from './chart.service';
import { CreateChartDto } from './dto/create-chart.dto';
import { UpdateChartDto } from './dto/update-chart.dto';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/charts')
export class ChartController {
  private readonly logger = new Logger(ChartController.name);

  constructor(private readonly chartService: ChartService) {}

  @Post()
  async create(@Body() createChartDto: CreateChartDto) {
    try {
      this.logger.log(`Creating chart: ${JSON.stringify(createChartDto)}`);
      return await this.chartService.create(createChartDto);
    } catch (error) {
      this.logger.error(`Error creating chart: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.chartService.findAll();
    } catch (error) {
      this.logger.error(`Error finding all charts: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.chartService.findOne(id);
    } catch (error) {
      this.logger.error(`Error finding chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateChartDto: UpdateChartDto) {
    try {
      this.logger.log(`Updating chart ${id}: ${JSON.stringify(updateChartDto)}`);
      return await this.chartService.update(id, updateChartDto);
    } catch (error) {
      this.logger.error(`Error updating chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      this.logger.log(`Removing chart ${id}`);
      return await this.chartService.remove(id);
    } catch (error) {
      this.logger.error(`Error removing chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Drawings endpoints
  @Post(':id/drawings')
  async addDrawing(@Param('id') id: string, @Body() createDrawingDto: CreateDrawingDto) {
    try {
      this.logger.log(`Adding drawing to chart ${id}: ${JSON.stringify(createDrawingDto)}`);
      return await this.chartService.addDrawing(id, createDrawingDto);
    } catch (error) {
      this.logger.error(`Error adding drawing to chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id/drawings')
  async getDrawings(@Param('id') id: string) {
    try {
      return await this.chartService.getDrawings(id);
    } catch (error) {
      this.logger.error(`Error getting drawings for chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Put(':id/drawings/:drawingId')
  async updateDrawing(
    @Param('id') id: string,
    @Param('drawingId') drawingId: string,
    @Body() updateDrawingDto: any,
  ) {
    try {
      this.logger.log(`Updating drawing ${drawingId} for chart ${id}: ${JSON.stringify(updateDrawingDto)}`);
      return await this.chartService.updateDrawing(id, drawingId, updateDrawingDto);
    } catch (error) {
      this.logger.error(`Error updating drawing ${drawingId} for chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id/drawings/:drawingId')
  async removeDrawing(@Param('id') id: string, @Param('drawingId') drawingId: string) {
    try {
      this.logger.log(`Removing drawing ${drawingId} from chart ${id}`);
      return await this.chartService.removeDrawing(id, drawingId);
    } catch (error) {
      this.logger.error(`Error removing drawing ${drawingId} from chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Indicators endpoints
  @Post(':id/indicators')
  async addIndicator(@Param('id') id: string, @Body() createIndicatorDto: CreateIndicatorDto) {
    try {
      this.logger.log(`Adding indicator to chart ${id}: ${JSON.stringify(createIndicatorDto)}`);
      return await this.chartService.addIndicator(id, createIndicatorDto);
    } catch (error) {
      this.logger.error(`Error adding indicator to chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id/indicators')
  async getIndicators(@Param('id') id: string) {
    try {
      return await this.chartService.getIndicators(id);
    } catch (error) {
      this.logger.error(`Error getting indicators for chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Put(':id/indicators/:indicatorId')
  async updateIndicator(
    @Param('id') id: string,
    @Param('indicatorId') indicatorId: string,
    @Body() updateIndicatorDto: any,
  ) {
    try {
      this.logger.log(`Updating indicator ${indicatorId} for chart ${id}: ${JSON.stringify(updateIndicatorDto)}`);
      return await this.chartService.updateIndicator(id, indicatorId, updateIndicatorDto);
    } catch (error) {
      this.logger.error(`Error updating indicator ${indicatorId} for chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id/indicators/:indicatorId')
  async removeIndicator(@Param('id') id: string, @Param('indicatorId') indicatorId: string) {
    try {
      this.logger.log(`Removing indicator ${indicatorId} from chart ${id}`);
      return await this.chartService.removeIndicator(id, indicatorId);
    } catch (error) {
      this.logger.error(`Error removing indicator ${indicatorId} from chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Chart data endpoint
  @Get('data/:symbol')
  async getChartData(
    @Param('symbol') symbol: string,
    @Query('from') from: number,
    @Query('to') to: number,
    @Query('interval') interval: string,
  ) {
    try {
      this.logger.log(`Getting chart data for ${symbol} from ${from} to ${to} with interval ${interval}`);
      return await this.chartService.getChartData(symbol, from, to, interval);
    } catch (error) {
      this.logger.error(`Error getting chart data for ${symbol}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
