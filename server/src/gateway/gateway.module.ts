import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayGateway } from './gateway.gateway';
import { PrinterModule } from 'src/printer/printer.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [PrinterModule, CommonModule],
  providers: [GatewayService, GatewayGateway],
  exports: [GatewayService]
})
export class GatewayModule {}
