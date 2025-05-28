import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ChartModule } from './modules/chart/chart.module';
import { AuthModule } from './modules/auth/auth.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { DataSeederModule } from './modules/data-seeder/data-seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Railway provides DATABASE_URL, but we'll keep individual variables as fallback
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || process.env.PGHOST,
      port: parseInt(process.env.DB_PORT || process.env.PGPORT) || 5432,
      username: process.env.DB_USERNAME || process.env.PGUSER,
      password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
      database: process.env.DB_NAME || process.env.PGDATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    AuthModule,
    ChartModule,
    WebSocketModule,
    DataSeederModule,
  ],
})
export class AppModule {}