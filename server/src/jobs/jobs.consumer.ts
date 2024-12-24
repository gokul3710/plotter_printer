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
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();

    await channel.assertQueue(this.queueName, { durable: true });

    channel.consume(
      this.queueName,
      async (msg) => {
        if (msg) {
          const job = JSON.parse(msg.content.toString());
          const { clientId, ...jobDetails } = job;
          this.gatewayService.dispatchPrintJob(clientId, jobDetails);

          channel.ack(msg);
        }
      },
      { noAck: false },
    );
  }
}
