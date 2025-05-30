import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chart } from '../../entities/chart.entity';
import { Drawing } from '../../entities/drawing.entity';
import { Indicator } from '../../entities/indicator.entity';
import { ChartData } from '../../entities/chart-data.entity';
import { CreateChartDto, UpdateChartDto, CreateDrawingDto, CreateIndicatorDto, UpdateDrawingDto } from './chart.dto';
import { WebSocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class ChartService {
  constructor(
    @InjectRepository(Chart)
    private chartRepository: Repository<Chart>,
    @InjectRepository(Drawing)
    private drawingRepository: Repository<Drawing>,
    @InjectRepository(Indicator)
    private indicatorRepository: Repository<Indicator>,
    @InjectRepository(ChartData)
    private chartDataRepository: Repository<ChartData>,
    private wsGateway: WebSocketGateway,
  ) {}

  async createChart(createChartDto: CreateChartDto, userId: string): Promise<Chart> {
    const chart = this.chartRepository.create({
      ...createChartDto,
    });
    const savedChart = await this.chartRepository.save(chart);
    
    this.wsGateway.broadcastChartUpdate(savedChart.id, 'chart:created', savedChart);
    return savedChart;
  }

  async getChart(chartId: string): Promise<Chart> {
    const chart = await this.chartRepository.findOne({
      where: { id: chartId },
      relations: ['drawings', 'indicators'],
    });
    
    if (!chart) {
      throw new NotFoundException('Chart not found');
    }
    
    return chart;
  }

  async updateChart(chartId: string, updateChartDto: UpdateChartDto): Promise<Chart> {
    await this.chartRepository.update(chartId, updateChartDto);
    const updatedChart = await this.getChart(chartId);
    
    this.wsGateway.broadcastChartUpdate(chartId, 'chart:updated', updatedChart);
    return updatedChart;
  }

  async addDrawing(chartId: string, createDrawingDto: CreateDrawingDto, userId: string): Promise<Drawing> {
    const drawing = this.drawingRepository.create({
      type: createDrawingDto.type,
      coordinates: createDrawingDto.coordinates,
      style: createDrawingDto.style,
      chart: { id: chartId },
    });
    
    const savedDrawing = await this.drawingRepository.save(drawing);
    this.wsGateway.broadcastChartUpdate(chartId, 'drawing:added', savedDrawing);
    
    return savedDrawing;
  }

  async updateDrawing(drawingId: string, updateData: UpdateDrawingDto): Promise<Drawing> {
    const updateObject: any = {};
    
    if (updateData.coordinates) {
      updateObject.coordinates = updateData.coordinates;
    }
    
    if (updateData.style) {
      updateObject.style = updateData.style;
    }
    
    if (updateData.type) {
      updateObject.type = updateData.type;
    }

    await this.drawingRepository.update(drawingId, updateObject);
    
    const drawing = await this.drawingRepository.findOne({
      where: { id: drawingId },
      relations: ['chart'],
    });
    
    if (drawing) {
      this.wsGateway.broadcastChartUpdate(drawing.chart.id, 'drawing:updated', drawing);
    }
    return drawing;
  }

  async deleteDrawing(drawingId: string): Promise<void> {
    const drawing = await this.drawingRepository.findOne({
      where: { id: drawingId },
      relations: ['chart'],
    });
    
    if (drawing) {
      await this.drawingRepository.delete(drawingId);
      this.wsGateway.broadcastChartUpdate(drawing.chart.id, 'drawing:deleted', { id: drawingId });
    }
  }

  async addIndicator(chartId: string, createIndicatorDto: CreateIndicatorDto, userId: string): Promise<Indicator> {
    try {
      console.log('Creating indicator with data:', {
        type: createIndicatorDto.type,
        parameters: createIndicatorDto.parameters,
        style: createIndicatorDto.style,
        chartId
      });

      // Don't convert to lowercase - keep as received from frontend
      const indicator = this.indicatorRepository.create({
        type: createIndicatorDto.type, // Keep uppercase (SMA, EMA, etc.)
        parameters: createIndicatorDto.parameters,
        style: createIndicatorDto.style || { color: '#ffaa00', lineWidth: 2 },
        displayOrder: createIndicatorDto.displayOrder || 0,
        chart: { id: chartId },
      });
      
      console.log('Created indicator entity:', indicator);
      
      const savedIndicator = await this.indicatorRepository.save(indicator);
      console.log('Saved indicator:', savedIndicator);
      
      this.wsGateway.broadcastChartUpdate(chartId, 'indicator:added', savedIndicator);
      
      return savedIndicator;
    } catch (error) {
      console.error('Error in addIndicator:', error);
      throw error;
    }
  }

  async updateIndicator(indicatorId: string, updateData: any): Promise<Indicator> {
    await this.indicatorRepository.update(indicatorId, updateData);
    
    const indicator = await this.indicatorRepository.findOne({
      where: { id: indicatorId },
      relations: ['chart'],
    });
    
    if (indicator) {
      this.wsGateway.broadcastChartUpdate(indicator.chart.id, 'indicator:updated', indicator);
    }
    
    return indicator;
  }

  async deleteIndicator(indicatorId: string): Promise<void> {
    const indicator = await this.indicatorRepository.findOne({
      where: { id: indicatorId },
      relations: ['chart'],
    });
    
    if (indicator) {
      await this.indicatorRepository.delete(indicatorId);
      this.wsGateway.broadcastChartUpdate(indicator.chart.id, 'indicator:deleted', { id: indicatorId });
    }
  }

  async getChartData(symbol: string, from: number, to: number, interval: string): Promise<any[]> {
    console.log(`Getting chart data for ${symbol} from ${from} to ${to} with interval ${interval}`);
    
    // Convert from seconds to milliseconds for database query
    const fromMs = from * 1000;
    const toMs = to * 1000;
    
    const data = await this.chartDataRepository
      .createQueryBuilder('data')
      .where('data.symbol = :symbol', { symbol })
      .andWhere('data.timestamp >= :from', { from: fromMs })
      .andWhere('data.timestamp <= :to', { to: toMs })
      .orderBy('data.timestamp', 'ASC')
      .limit(2000)
      .getMany();

    console.log(`Found ${data.length} records in database for ${symbol}`);

    if (data.length > 0) {
      const formattedData = data.map(item => ({
        time: Math.floor(item.timestamp / 1000),
        open: parseFloat(item.open.toString()),
        high: parseFloat(item.high.toString()),
        low: parseFloat(item.low.toString()),
        close: parseFloat(item.close.toString()),
        volume: parseFloat(item.volume.toString()),
      }));
      
      console.log(`Returning ${formattedData.length} formatted records`);
      return formattedData;
    }

    console.log('No data found in database, returning empty array');
    return [];
  }

  async getOrCreateDemoChart(): Promise<Chart> {
    let chart = await this.chartRepository.findOne({
      where: { name: 'Demo Chart' },
      relations: ['drawings', 'indicators'],
    });

    if (!chart) {
      const demoChart = {
        name: 'Demo Chart',
        symbol: 'BTCUSD',
        chartType: 'candlestick' as const,
        timeframe: '1h',
        settings: {
          theme: 'dark' as const,
          gridLines: true,
          volume: true,
        }
      };
      chart = await this.createChart(demoChart, 'demo-user');
    }

    return chart;
  }

  async getDrawingsForChart(chartId: string): Promise<Drawing[]> {
    return this.drawingRepository.find({
      where: { chart: { id: chartId } },
      order: { createdAt: 'ASC' }
    });
  }

  async getIndicatorsForChart(chartId: string): Promise<Indicator[]> {
    return this.indicatorRepository.find({
      where: { chart: { id: chartId } },
      order: { displayOrder: 'ASC', createdAt: 'ASC' }
    });
  }
}
