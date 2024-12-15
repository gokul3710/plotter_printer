import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class GatewayService {
  private server: Server;

  // Set the WebSocket server instance
  setServer(server: Server) {
    this.server = server;
  }

  // Broadcast a message to all connected clients
  broadcast(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, data);
    } else {
      console.error('WebSocket server is not initialized.');
    }
  }

  // Get a list of all connected clients
  getConnectedClients() {
    const connectedClients = Array.from(this.server.sockets.sockets.values());
    console.log('Connected Clients:', connectedClients);
    return connectedClients.map((client) => client);  // Return only client IDs
  }

  // Send a message to a specific client
  sendToClient(clientId: string, event: string, data: any) {
    if (this.server) {
      const client = this.server.sockets.sockets.get(clientId);
      if (client) {
        console.log(`Sending event ${event} to client ${clientId}.`);
        client.emit(event, data);
      } else {
        console.error(`Client with ID ${clientId} is not connected.`);
      }
    } else {
      console.error('WebSocket server is not initialized.');
    }
  }

  // Handle printer registration
  registerPrinter(clientId: string, printerId: string) {
    console.log(`Printer ${printerId} registered by client ${clientId}.`);
    // Logic to associate client with printer (e.g., save to database)
  }

  // Handle print job dispatch
  dispatchPrintJob(clientId: string, job: any) {
    console.log(`Dispatching print job to client ${clientId}.`);
    this.sendToClient(clientId, 'printJob', job);
  }
}
