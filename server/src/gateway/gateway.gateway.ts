import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GatewayService } from './gateway.service';
import { PrinterService } from 'src/printer/printer.service';
import { CreatePrinterDto } from 'src/printer/dto/create-printer.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GatewayGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewayService: GatewayService,
    private readonly printerService: PrinterService,
  ) { }

  onModuleInit() {
    this.gatewayService.setServer(this.server);
    console.log('WebSocket server initialized');
  }

  // Get a list of all connected clients
  getConnectedClients() {
    const connectedClients = Array.from(this.server.sockets.sockets.values());
    console.log('Connected Clients:', connectedClients);
    return connectedClients.map((client) => client.id);  // Return only client IDs
  }

  @SubscribeMessage('registerPrinter')
  handleRegisterPrinter(client: any, payload: CreatePrinterDto): string {
    this.printerService.addPrinter(payload);
    return 'Printer registered successfully';
  }

  @SubscribeMessage('printComplete')
  handlePrintComplete(client: any, payload: any): string {
    console.log('Print Job Complete:', payload);
    return 'Print job completed successfully';
  }
}
