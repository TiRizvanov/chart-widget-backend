import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity('chart_data')
@Index(['symbol', 'timestamp'])
export class ChartData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  symbol: string;

  @Column({ type: 'bigint' })
  timestamp: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  open: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  high: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  low: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  close: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  volume: number;

  @CreateDateColumn()
  createdAt: Date;
}
