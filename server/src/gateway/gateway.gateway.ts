import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GatewayService } from './gateway.service';
import { PrinterService } from 'src/printer/printer.service';
import { CreatePrinterDto } from 'src/printer/dto/create-printer.dto';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(JwtAuthGuard)
export class GatewayGateway {
  @WebSocketServer()
  server: Server;
  clients = new Map();

  constructor(
    private readonly gatewayService: GatewayService,
    private readonly printerService: PrinterService,
  ) { }

  onModuleInit() {
    this.gatewayService.setServer(this.server);
    console.log('WebSocket server initialized');
  }

  handleConnection(client: any) {}
  
  getConnectedClients() {
    const connectedClients = Array.from(this.server.sockets.sockets.values());
    return connectedClients.map((client) => client.id);
  }

  @SubscribeMessage('registerPrinter')
  async handleRegisterPrinter(client: any, payload: CreatePrinterDto): Promise<string> {
    const user = client.user;
    this.gatewayService.clients.set(user.userId, client.id);
    this.printerService.addPrinter({...payload}, user.userId);
    return 'Printer registered successfully';
  }

  @SubscribeMessage('printComplete')
  handlePrintComplete(client: any, payload: any): string {
    console.log('Print Job Complete:', payload);
    return 'Print job completed successfully';
  }
}
