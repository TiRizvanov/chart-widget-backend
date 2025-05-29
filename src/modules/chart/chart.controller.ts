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
    // Use a demo user ID for now
    const demoUserId = 'demo-user-123';
    return this.chartService.addDrawing(chartId, createDrawingDto, demoUserId);
  }

  @Post(':id/indicators')
  async addIndicator(
    @Param('id') chartId: string,
    @Body() createIndicatorDto: CreateIndicatorDto,
  ) {
    // Use a demo user ID for now
    const demoUserId = 'demo-user-123';
    return this.chartService.addIndicator(chartId, createIndicatorDto, demoUserId);
  }

  // Add the missing endpoint for chart data
  @Get('data/:symbol')
  async getChartData(
    @Param('symbol') symbol: string,
    @Query('from') from: number,
    @Query('to') to: number,
    @Query('interval') interval: string,
  ) {
    return this.chartService.getChartData(symbol, from, to, interval);
  }
}
