import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GatewayService } from './gateway.service';

@WebSocketGateway({
  cors: {
    origin: '*',  // Allows connections from any origin (use '*' for all origins or specify your domain)
  },
})
export class GatewayGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gatewayService: GatewayService) { }

  onModuleInit() {
    // Assign the server instance to the GatewayService
    this.gatewayService.setServer(this.server);
    console.log('WebSocket server initialized');
  }

  // // Handle incoming WebSocket events
  // @SubscribeMessage('registerPrinter')
  // handleRegisterPrinter(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: { printerId: string },
  // ) {
  //   console.log(`Client ${client.id} registered printer ${payload.printerId}`);
  //   this.gatewayService.registerPrinter(client.id, payload.printerId);
  //   return { status: 'success', message: 'Printer registered' };
  // }

  // Get a list of all connected clients
  getConnectedClients() {
    const connectedClients = Array.from(this.server.sockets.sockets.values());
    console.log('Connected Clients:', connectedClients);
    return connectedClients.map((client) => client.id);  // Return only client IDs
  }

  @SubscribeMessage('registerPrinter')
  handleRegisterPrinter(client: any, payload: any): string {
    console.log('Printer Registered:', payload);
    console.log(this.getConnectedClients());
    return 'Printer registered successfully';
  }

  @SubscribeMessage('printComplete')
  handlePrintComplete(client: any, payload: any): string {
    console.log('Print Job Complete:', payload);
    return 'Print job completed successfully';
  }
}
