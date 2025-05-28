import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Chart } from './chart.entity';
import { User } from './user.entity';

@Entity('indicators')
export class Indicator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['SMA', 'EMA', 'RSI', 'MACD', 'BOLLINGER', 'VOLUME', 'STOCHASTIC', 'ATR'], // Keep uppercase to match frontend
  })
  type: string;

  @Column({ type: 'jsonb' })
  parameters: {
    period?: number;
    periods?: number[];
    source?: 'close' | 'open' | 'high' | 'low' | 'hl2' | 'hlc3' | 'ohlc4';
    deviation?: number;
    fastPeriod?: number;
    slowPeriod?: number;
    signalPeriod?: number;
    kPeriod?: number;
    dPeriod?: number;
    smooth?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  style: {
    color?: string;
    colors?: string[];
    lineWidth?: number;
    opacity?: number;
    showInLegend?: boolean;
  };

  @ManyToOne(() => Chart, chart => chart.indicators, { onDelete: 'CASCADE' })
  chart: Chart;

  @ManyToOne(() => User, { nullable: true })
  createdBy?: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  visible: boolean;

  @Column({ default: 0 })
  displayOrder: number;
}