import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Chart } from './chart.entity';
import { User } from './user.entity';

@Entity('drawings')
export class Drawing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['trendline', 'horizontal', 'vertical', 'rectangle', 'text'],
  })
  type: 'trendline' | 'horizontal' | 'vertical' | 'rectangle' | 'text';

  @Column({ type: 'jsonb' })
  coordinates: {
    startTime: number;
    startPrice: number;
    endTime?: number;
    endPrice?: number;
  };

  @Column({ type: 'jsonb' })
  style: {
    color: string;
    lineWidth: number;
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    fillColor?: string;
    text?: string;
    fontSize?: number;
    opacity?: number;
  };

  @ManyToOne(() => Chart, chart => chart.drawings, { onDelete: 'CASCADE' })
  chart: Chart;

  @ManyToOne(() => User, { nullable: true })
  createdBy?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  visible: boolean;

  @Column({ default: false })
  locked: boolean;

  // Helper method to check if drawing is complete
  isComplete(): boolean {
    switch (this.type) {
      case 'horizontal':
      case 'vertical':
      case 'text':
        return true; // These only need start coordinates
      case 'trendline':
      case 'rectangle':
        return !!(this.coordinates.endTime && this.coordinates.endPrice);
      default:
        return false;
    }
  }

  // Helper method to get bounding box for selection
  getBoundingBox(chartBounds: { priceMin: number; priceMax: number; timeMin: number; timeMax: number; width: number; height: number }) {
    const { timeMin, timeMax, priceMin, priceMax, width, height } = chartBounds;
    const timeRange = timeMax - timeMin;
    const priceRange = priceMax - priceMin;

    const startX = ((this.coordinates.startTime - timeMin) / timeRange) * width;
    const startY = height - ((this.coordinates.startPrice - priceMin) / priceRange) * height;

    switch (this.type) {
      case 'horizontal':
        return {
          x: 0,
          y: startY - 5,
          width: width,
          height: 10
        };
      
      case 'vertical':
        return {
          x: startX - 5,
          y: 0,
          width: 10,
          height: height
        };
      
      case 'text':
        return {
          x: startX - 10,
          y: startY - 10,
          width: (this.style.text?.length || 0) * 8,
          height: 20
        };
      
      case 'trendline':
        if (this.coordinates.endTime && this.coordinates.endPrice) {
          const endX = ((this.coordinates.endTime - timeMin) / timeRange) * width;
          const endY = height - ((this.coordinates.endPrice - priceMin) / priceRange) * height;
          
          return {
            x: Math.min(startX, endX) - 5,
            y: Math.min(startY, endY) - 5,
            width: Math.abs(endX - startX) + 10,
            height: Math.abs(endY - startY) + 10
          };
        }
        break;
      
      case 'rectangle':
        if (this.coordinates.endTime && this.coordinates.endPrice) {
          const endX = ((this.coordinates.endTime - timeMin) / timeRange) * width;
          const endY = height - ((this.coordinates.endPrice - priceMin) / priceRange) * height;
          
          return {
            x: Math.min(startX, endX),
            y: Math.min(startY, endY),
            width: Math.abs(endX - startX),
            height: Math.abs(endY - startY)
          };
        }
        break;
    }

    return { x: startX - 5, y: startY - 5, width: 10, height: 10 };
  }

  // Helper method to check if point is within drawing bounds
  containsPoint(x: number, y: number, chartBounds: any, tolerance: number = 5): boolean {
    const bbox = this.getBoundingBox(chartBounds);
    return x >= bbox.x - tolerance && 
           x <= bbox.x + bbox.width + tolerance && 
           y >= bbox.y - tolerance && 
           y <= bbox.y + bbox.height + tolerance;
  }
}