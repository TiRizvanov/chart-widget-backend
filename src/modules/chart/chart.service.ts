import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chart } from './entities/chart.entity';
import { Drawing } from './entities/drawing.entity';
import { Indicator } from './entities/indicator.entity';
import { CreateChartDto } from './dto/create-chart.dto';
import { UpdateChartDto } from './dto/update-chart.dto';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { CreateIndicatorDto } from './dto/create-indicator.dto';

@Injectable()
export class ChartService {
  private readonly logger = new Logger(ChartService.name);

  constructor(
    @InjectRepository(Chart)
    private chartRepository: Repository<Chart>,
    @InjectRepository(Drawing)
    private drawingRepository: Repository<Drawing>,
    @InjectRepository(Indicator)
    private indicatorRepository: Repository<Indicator>,
  ) {}

  async create(createChartDto: CreateChartDto): Promise<Chart> {
    try {
      const chart = this.chartRepository.create({
        ...createChartDto,
        drawings: [],
        indicators: [],
      });
      return await this.chartRepository.save(chart);
    } catch (error) {
      this.logger.error(`Failed to create chart: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create chart: ${error.message}`);
    }
  }

  async findAll(): Promise<Chart[]> {
    try {
      return await this.chartRepository.find({
        relations: ['drawings', 'indicators'],
      });
    } catch (error) {
      this.logger.error(`Failed to find all charts: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<Chart> {
    try {
      const chart = await this.chartRepository.findOne({
        where: { id },
        relations: ['drawings', 'indicators'],
      });
      
      if (!chart) {
        throw new NotFoundException(`Chart with ID ${id} not found`);
      }
      
      return chart;
    } catch (error) {
      this.logger.error(`Failed to find chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateChartDto: UpdateChartDto): Promise<Chart> {
    try {
      const chart = await this.findOne(id);
      
      // Update chart properties
      Object.assign(chart, updateChartDto);
      
      return await this.chartRepository.save(chart);
    } catch (error) {
      this.logger.error(`Failed to update chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const chart = await this.findOne(id);
      await this.chartRepository.remove(chart);
    } catch (error) {
      this.logger.error(`Failed to remove chart ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Drawings methods
  async addDrawing(chartId: string, createDrawingDto: CreateDrawingDto): Promise<Drawing> {
    try {
      this.logger.log(`Adding drawing to chart ${chartId}: ${JSON.stringify(createDrawingDto)}`);
      
      // Find the chart
      const chart = await this.findOne(chartId);
      
      // Create the drawing
      const drawing = this.drawingRepository.create({
        ...createDrawingDto,
        chart,
        visible: true,
      });
      
      // Save the drawing
      return await this.drawingRepository.save(drawing);
    } catch (error) {
      this.logger.error(`Failed to add drawing to chart ${chartId}: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to add drawing: ${error.message}`);
    }
  }

  async getDrawings(chartId: string): Promise<Drawing[]> {
    try {
      // Find the chart to ensure it exists
      await this.findOne(chartId);
      
      // Get all drawings for this chart
      return await this.drawingRepository.find({
        where: { chart: { id: chartId } },
      });
    } catch (error) {
      this.logger.error(`Failed to get drawings for chart ${chartId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateDrawing(chartId: string, drawingId: string, updateDrawingDto: any): Promise<Drawing> {
    try {
      // Find the chart to ensure it exists
      await this.findOne(chartId);
      
      // Find the drawing
      const drawing = await this.drawingRepository.findOne({
        where: { id: drawingId, chart: { id: chartId } },
      });
      
      if (!drawing) {
        throw new NotFoundException(`Drawing with ID ${drawingId} not found in chart ${chartId}`);
      }
      
      // Update drawing properties
      Object.assign(drawing, updateDrawingDto);
      
      // Save the drawing
      return await this.drawingRepository.save(drawing);
    } catch (error) {
      this.logger.error(`Failed to update drawing ${drawingId} for chart ${chartId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeDrawing(chartId: string, drawingId: string): Promise<void> {
    try {
      // Find the chart to ensure it exists
      await this.findOne(chartId);
      
      // Find the drawing
      const drawing = await this.drawingRepository.findOne({
        where: { id: drawingId, chart: { id: chartId } },
      });
      
      if (!drawing) {
        throw new NotFoundException(`Drawing with ID ${drawingId} not found in chart ${chartId}`);
      }
      
      // Remove the drawing
      await this.drawingRepository.remove(drawing);
    } catch (error) {
      this.logger.error(`Failed to remove drawing ${drawingId} from chart ${chartId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Indicators methods
  async addIndicator(chartId: string, createIndicatorDto: CreateIndicatorDto): Promise<Indicator> {
    try {
      this.logger.log(`Adding indicator to chart ${chartId}: ${JSON.stringify(createIndicatorDto)}`);
      
      // Find the chart
      const chart = await this.findOne(chartId);
      
      // Create the indicator
      const indicator = this.indicatorRepository.create({
        ...createIndicatorDto,
        chart,
        visible: true,
      });
      
      // Save the indicator
      return await this.indicatorRepository.save(indicator);
    } catch (error) {
      this.logger.error(`Failed to add indicator to chart ${chartId}: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to add indicator: ${error.message}`);
    }
  }

  async getIndicators(chartId: string): Promise<Indicator[]> {
    try {
      // Find the chart to ensure it exists
      await this.findOne(chartId);
      
      // Get all indicators for this chart
      return await this.indicatorRepository.find({
        where: { chart: { id: chartId } },
      });
    } catch (error) {
      this.logger.error(`Failed to get indicators for chart ${chartId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateIndicator(chartId: string, indicatorId: string, updateIndicatorDto: any): Promise<Indicator> {
    try {
      // Find the chart to ensure it exists
      await this.findOne(chartId);
      
      // Find the indicator
      const indicator = await this.indicatorRepository.findOne({
        where: { id: indicatorId, chart: { id: chartId } },
      });
      
      if (!indicator) {
        throw new NotFoundException(`Indicator with ID ${indicatorId} not found in chart ${chartId}`);
      }
      
      // Update indicator properties
      Object.assign(indicator, updateIndicatorDto);
      
      // Save the indicator
      return await this.indicatorRepository.save(indicator);
    } catch (error) {
      this.logger.error(`Failed to update indicator ${indicatorId} for chart ${chartId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeIndicator(chartId: string, indicatorId: string): Promise<void> {
    try {
      // Find the chart to ensure it exists
      await this.findOne(chartId);
      
      // Find the indicator
      const indicator = await this.indicatorRepository.findOne({
        where: { id: indicatorId, chart: { id: chartId } },
      });
      
      if (!indicator) {
        throw new NotFoundException(`Indicator with ID ${indicatorId} not found in chart ${chartId}`);
      }
      
      // Remove the indicator
      await this.indicatorRepository.remove(indicator);
    } catch (error) {
      this.logger.error(`Failed to remove indicator ${indicatorId} from chart ${chartId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Chart data method
  async getChartData(symbol: string, from: number, to: number, interval: string): Promise<any[]> {
    try {
      this.logger.log(`Getting chart data for ${symbol} from ${from} to ${to} with interval ${interval}`);
      
      // This would typically call a data provider or database
      // For now, we'll return mock data from the database
      const mockData = await this.getMockChartData(symbol, from, to, interval);
      return mockData;
    } catch (error) {
      this.logger.error(`Failed to get chart data for ${symbol}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async getMockChartData(symbol: string, from: number, to: number, interval: string): Promise<any[]> {
    // Implementation would depend on your data source
    // This is just a placeholder
    return [];
  }
}
