import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class JobsService {
  private queueName = 'print_jobs';

  async submitJob(job: any) {

    try {
      console.log(job);
      const connection = await amqp.connect('amqp://guest:guest@127.0.0.1');
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

