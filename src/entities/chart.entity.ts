import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Drawing } from './drawing.entity';
import { Indicator } from './indicator.entity';
import { User } from './user.entity';

@Entity('charts')
export class Chart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column({
    type: 'enum',
    enum: ['line', 'candlestick'],
    default: 'candlestick'
  })
  chartType: string;

  @Column({
    type: 'enum',
    enum: ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M'],
    default: '1h'
  })
  timeframe: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: {
    theme?: 'light' | 'dark';
    gridLines?: boolean;
    volume?: boolean;
    scales?: any;
  };

  @OneToMany(() => Drawing, drawing => drawing.chart, { cascade: true })
  drawings: Drawing[];

  @OneToMany(() => Indicator, indicator => indicator.chart, { cascade: true })
  indicators: Indicator[];

  @ManyToMany(() => User, user => user.charts, { nullable: true })
  @JoinTable()
  users?: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
