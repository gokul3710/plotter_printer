import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { GatewayService } from 'src/gateway/gateway.service';

@Injectable()
export class JobsService {
  private queueName = 'print_jobs';

  constructor (private readonly gatewayService: GatewayService) {}

  async submitJob(job: any) {

    try {

      const clientId = await this.gatewayService.getActiveClientId(job.userId);
      job.clientId = clientId;

      if(!clientId) {
        console.error('No active client found for user:', job.userId);
        return;
      }
      
      const connection = await amqp.connect(process.env.RABBITMQ_URI);
      const channel = await connection.createChannel();

      await channel.assertQueue(this.queueName, { durable: true });
      channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(job)));

      await channel.close();
      await connection.close();

    } catch (error) {
      console.error('Error submitting job:', error);
    }
  }
}

