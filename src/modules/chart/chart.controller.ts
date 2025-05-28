import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ChartService } from './chart.service';
import { CreateChartDto, UpdateChartDto, CreateDrawingDto, CreateIndicatorDto, UpdateDrawingDto } from './chart.dto';

@Controller('api/charts')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Post()
  async createChart(@Body() createChartDto: CreateChartDto) {
    // Use a demo user ID for now
    const demoUserId = 'demo-user-123';
    return this.chartService.createChart(createChartDto, demoUserId);
  }

  @Get(':id')
  async getChart(@Param('id') id: string) {
    return this.chartService.getChart(id);
  }

  @Put(':id')
  async updateChart(@Param('id') id: string, @Body() updateChartDto: UpdateChartDto) {
    return this.chartService.updateChart(id, updateChartDto);
  }

  @Post(':id/drawings')
  async addDrawing(
    @Param('id') chartId: string,
    @Body() createDrawingDto: CreateDrawingDto,
  ) {
    const demoUserId = 'demo-user-123';
    return this.chartService.addDrawing(chartId, createDrawingDto, demoUserId);
  }

  @Put('drawings/:drawingId')
  async updateDrawing(
    @Param('drawingId') drawingId: string, 
    @Body() updateDrawingDto: UpdateDrawingDto
  ) {
    return this.chartService.updateDrawing(drawingId, updateDrawingDto);
  }

  @Delete('drawings/:drawingId')
  async deleteDrawing(@Param('drawingId') drawingId: string) {
    await this.chartService.deleteDrawing(drawingId);
    return { success: true };
  }

  @Post(':id/indicators')
  async addIndicator(
    @Param('id') chartId: string,
    @Body() createIndicatorDto: CreateIndicatorDto,
  ) {
    const demoUserId = 'demo-user-123';
    return this.chartService.addIndicator(chartId, createIndicatorDto, demoUserId);
  }

  @Put('indicators/:indicatorId')
  async updateIndicator(
    @Param('indicatorId') indicatorId: string,
    @Body() updateData: any
  ) {
    return this.chartService.updateIndicator(indicatorId, updateData);
  }

  @Delete('indicators/:indicatorId')
  async deleteIndicator(@Param('indicatorId') indicatorId: string) {
    await this.chartService.deleteIndicator(indicatorId);
    return { success: true };
  }

  @Get(':id/drawings')
  async getDrawings(@Param('id') chartId: string) {
    return this.chartService.getDrawingsForChart(chartId);
  }

  @Get(':id/indicators')
  async getIndicators(@Param('id') chartId: string) {
    return this.chartService.getIndicatorsForChart(chartId);
  }

  @Get('data/:symbol')
  async getChartData(
    @Param('symbol') symbol: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('interval') interval: string,
  ) {
    return this.chartService.getChartData(symbol, parseInt(from), parseInt(to), interval);
  }

  // Add a demo endpoint to create sample chart
  @Post('demo/create')
  async createDemoChart() {
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
    
    return this.chartService.createChart(demoChart, 'demo-user-123');
  }

  // Endpoint to get or create demo chart
  @Get('demo/chart')
  async getDemoChart() {
    return this.chartService.getOrCreateDemoChart();
  }
}