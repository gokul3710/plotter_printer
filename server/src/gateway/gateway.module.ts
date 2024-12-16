import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayGateway } from './gateway.gateway';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  imports: [PrinterModule],
  providers: [GatewayService, GatewayGateway],
  exports: [GatewayService]
})
export class GatewayModule {}
