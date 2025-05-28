import { Controller, Post, Get, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChartData } from '../../entities/chart-data.entity';

@Controller('api/data')
export class DataSeederController {
  constructor(
    @InjectRepository(ChartData)
    private chartDataRepository: Repository<ChartData>,
  ) {}

  @Post('seed')
  async seedData() {
    console.log('Starting data seeding...');
    
    // Check if data already exists
    const existingCount = await this.chartDataRepository.count();
    if (existingCount > 0) {
      return { 
        message: `Data already exists (${existingCount} records)`, 
        existing: existingCount 
      };
    }

    const symbols = ['BTCUSD', 'ETHUSD', 'ADAUSD'];
    let totalCreated = 0;

    for (const symbol of symbols) {
      const data = this.generateSampleData(symbol);
      await this.chartDataRepository.save(data);
      totalCreated += data.length;
      console.log(`Created ${data.length} records for ${symbol}`);
    }

    return { 
      message: 'Sample data created successfully!', 
      totalRecords: totalCreated,
      symbols: symbols
    };
  }

  @Get('count')
  async getDataCount() {
    const count = await this.chartDataRepository.count();
    const symbols = await this.chartDataRepository
      .createQueryBuilder('data')
      .select('DISTINCT data.symbol')
      .getRawMany();
    
    return {
      totalRecords: count,
      symbols: symbols.map(s => s.data_symbol)
    };
  }

  @Get('latest/:symbol')
  async getLatestData(
    @Param('symbol') symbol: string,
    @Query('limit') limit: string = '100'
  ) {
    const data = await this.chartDataRepository
      .createQueryBuilder('data')
      .where('data.symbol = :symbol', { symbol })
      .orderBy('data.timestamp', 'DESC')
      .limit(parseInt(limit))
      .getMany();

    return {
      symbol,
      count: data.length,
      latest: data.slice(0, 5).map(d => ({
        timestamp: d.timestamp,
        close: d.close,
        volume: d.volume
      }))
    };
  }

  private generateSampleData(symbol: string): Partial<ChartData>[] {
    const data: Partial<ChartData>[] = [];
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    
    // Generate 30 days of hourly data (720 points)
    const totalHours = 30 * 24;
    
    // Different starting prices for different symbols
    const startingPrices = {
      'BTCUSD': 45000,
      'ETHUSD': 2800,
      'ADAUSD': 0.45
    };
    
    let currentPrice = startingPrices[symbol] || 45000;
    
    for (let i = totalHours; i >= 0; i--) {
      const timestamp = now - (i * hourInMs);
      
      // Generate realistic price movement
      const volatility = symbol === 'BTCUSD' ? 0.03 : symbol === 'ETHUSD' ? 0.04 : 0.06;
      const change = (Math.random() - 0.5) * volatility;
      
      const open = currentPrice;
      const close = open * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.015);
      const low = Math.min(open, close) * (1 - Math.random() * 0.015);
      
      // Volume varies by symbol
      const baseVolume = symbol === 'BTCUSD' ? 1000 : symbol === 'ETHUSD' ? 5000 : 1000000;
      const volume = baseVolume * (0.5 + Math.random());
      
      data.push({
        symbol,
        timestamp,
        open: Number(open.toFixed(symbol === 'ADAUSD' ? 4 : 2)),
        high: Number(high.toFixed(symbol === 'ADAUSD' ? 4 : 2)),
        low: Number(low.toFixed(symbol === 'ADAUSD' ? 4 : 2)),
        close: Number(close.toFixed(symbol === 'ADAUSD' ? 4 : 2)),
        volume: Number(volume.toFixed(2)),
      });
      
      currentPrice = close;
    }
    
    return data;
  }

  @Post('clear')
  async clearData() {
    const count = await this.chartDataRepository.count();
    await this.chartDataRepository.clear();
    return { 
      message: `Cleared ${count} records from database` 
    };
  }
}