import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn } from 'typeorm';
import { Chart } from './chart.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @ManyToMany(() => Chart, chart => chart.users)
  charts: Chart[];

  @CreateDateColumn()
  createdAt: Date;
}
