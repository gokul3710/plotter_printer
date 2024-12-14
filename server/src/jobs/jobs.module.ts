import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobsConsumerService } from './jobs.consumer';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [GatewayModule],
  controllers: [JobsController],
  providers: [JobsService, JobsConsumerService],
})
export class JobsModule {}
