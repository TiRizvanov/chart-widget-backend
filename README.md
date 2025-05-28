# Chart Widget Backend

Trading chart widget backend built with NestJS and PostgreSQL.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Create PostgreSQL database:
```bash
createdb chart_widget
```

4. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

The API runs on `http://localhost:3000`

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Charts
- POST `/api/charts` - Create new chart
- GET `/api/charts/:id` - Get chart details
- PUT `/api/charts/:id` - Update chart
- POST `/api/charts/:id/drawings` - Add drawing
- POST `/api/charts/:id/indicators` - Add indicator

### WebSocket Events
- `join:chart` - Join chart room
- `leave:chart` - Leave chart room
- `cursor:move` - Broadcast cursor position

## Docker

Build and run with Docker:
```bash
docker build -t chart-widget-backend .
docker run -p 3000:3000 chart-widget-backend
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```
