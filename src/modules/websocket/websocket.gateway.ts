import { WebSocketGateway as WSGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WSGateway({
  cors: {
    origin: ['http://localhost:3001', 'https://localhost:3001', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
  },
  allowEIO3: true,
  transports: ['websocket', 'polling'],
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private chartRooms = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Set a demo user ID for the client
    client.data.userId = `user-${client.id.slice(0, 8)}`;
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.removeClientFromAllRooms(client.id);
  }

  @SubscribeMessage('join:chart')
  handleJoinChart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chartId: string },
  ) {
    const { chartId } = data;
    client.join(`chart:${chartId}`);

    if (!this.chartRooms.has(chartId)) {
      this.chartRooms.set(chartId, new Set());
    }
    this.chartRooms.get(chartId).add(client.id);

    // Notify other users
    client.to(`chart:${chartId}`).emit('user:joined', {
      userId: client.data.userId || client.id,
    });

    console.log(`Client ${client.id} joined chart ${chartId}`);
  }

  @SubscribeMessage('leave:chart')
  handleLeaveChart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chartId: string },
  ) {
    const { chartId } = data;
    client.leave(`chart:${chartId}`);

    if (this.chartRooms.has(chartId)) {
      this.chartRooms.get(chartId).delete(client.id);
    }

    // Notify other users
    client.to(`chart:${chartId}`).emit('user:left', {
      userId: client.data.userId || client.id,
    });

    console.log(`Client ${client.id} left chart ${chartId}`);
  }

  @SubscribeMessage('cursor:move')
  handleCursorMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chartId: string; x: number; y: number },
  ) {
    client.to(`chart:${data.chartId}`).emit('cursor:update', {
      userId: client.data.userId || client.id,
      x: data.x,
      y: data.y,
    });
  }

  @SubscribeMessage('drawing:start')
  handleDrawingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chartId: string; drawing: any },
  ) {
    client.to(`chart:${data.chartId}`).emit('drawing:started', {
      userId: client.data.userId || client.id,
      drawing: data.drawing,
    });
  }

  @SubscribeMessage('drawing:update')
  handleDrawingUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chartId: string; drawing: any },
  ) {
    client.to(`chart:${data.chartId}`).emit('drawing:updated', {
      userId: client.data.userId || client.id,
      drawing: data.drawing,
    });
  }

  broadcastChartUpdate(chartId: string, event: string, data: any) {
    this.server.to(`chart:${chartId}`).emit(event, data);
    console.log(`Broadcasting ${event} to chart ${chartId}`);
  }

  private removeClientFromAllRooms(clientId: string) {
    this.chartRooms.forEach((clients, chartId) => {
      if (clients.has(clientId)) {
        clients.delete(clientId);
        this.server.to(`chart:${chartId}`).emit('user:left', { userId: clientId });
      }
    });
  }
}
