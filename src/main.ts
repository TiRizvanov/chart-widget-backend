import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('Starting application bootstrap process...');
    const app = await NestFactory.create(AppModule);
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));

    // Comprehensive CORS configuration
    app.enableCors({
      origin: ['http://localhost:3001', 'https://localhost:3001', '*'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
      exposedHeaders: ['Content-Disposition'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // Use Railway's PORT environment variable
    const port = process.env.PORT || 3000;
    
    console.log(`Attempting to listen on port ${port}...`);
    await app.listen(port, '0.0.0.0'); // Listen on all interfaces
    
    console.log(`Application is running on port: ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database Host: ${process.env.DB_HOST || 'not set'}`);
  } catch (error) {
    console.error('Error during application bootstrap:', error);
    throw error;
  }
}

// Add error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

bootstrap().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
