import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { PrinterModule } from './printer/printer.module';

@Module({
  imports: [JobsModule, AuthModule, GatewayModule, PrinterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
