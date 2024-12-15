import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class JobsConsumerService implements OnModuleInit {
  private queueName = 'print_jobs';

  constructor(private gatewayService: GatewayService) {}

  async onModuleInit() {
    this.consumeJobs();
  }

  private async consumeJobs() {
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();

    await channel.assertQueue(this.queueName, { durable: true });

    console.log(`Waiting for messages in queue: ${this.queueName}`);

    channel.consume(
      this.queueName,
      async (msg) => {
        if (msg) {
          const job = JSON.parse(msg.content.toString());
          console.log('Job received:', job);

          // Dispatch job to client via WebSocket
          const { clientId, ...jobDetails } = job;
          console.log(this.gatewayService.getConnectedClients())
          this.gatewayService.dispatchPrintJob(clientId, jobDetails);

          // Acknowledge the job
          channel.ack(msg);
        }
      },
      { noAck: false }, // Ensure jobs are acknowledged after processing
    );
  }
}
