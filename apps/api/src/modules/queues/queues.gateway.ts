import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/queues' })
export class QueuesGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinQueue')
  handleJoinQueue(@MessageBody() queueId: string, @ConnectedSocket() client: Socket) {
    client.join(`queue:${queueId}`);
    return { event: 'joined', data: queueId };
  }

  @SubscribeMessage('joinDisplay')
  handleJoinDisplay(@MessageBody() healthUnitId: string, @ConnectedSocket() client: Socket) {
    client.join(`display:${healthUnitId}`);
    return { event: 'joinedDisplay', data: healthUnitId };
  }

  emitTicketCalled(queueId: string, ticket: any) {
    this.server.to(`queue:${queueId}`).emit('ticketCalled', ticket);
  }

  emitQueueUpdate(queueId: string, data: any) {
    this.server.to(`queue:${queueId}`).emit('queueUpdate', data);
  }

  emitDisplayUpdate(healthUnitId: string, data: any) {
    this.server.to(`display:${healthUnitId}`).emit('displayUpdate', data);
  }
}
