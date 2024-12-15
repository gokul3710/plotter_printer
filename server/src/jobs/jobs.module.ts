import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobsConsumerService } from './jobs.consumer';
import { GatewayModule } from '../gateway/gateway.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [GatewayModule,
    MulterModule.register({
      dest: './uploads', // Directory to save uploaded files
    }),
  ],
  controllers: [JobsController],
  providers: [JobsService, JobsConsumerService],
})
export class JobsModule {}

