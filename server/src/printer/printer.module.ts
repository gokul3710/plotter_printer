import { Module } from '@nestjs/common';
import { PrinterController } from './printer.controller';
import { PrinterService } from './printer.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from './printer.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Printer]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PrinterController],
  providers: [PrinterService],
  exports: [PrinterService],
})
export class PrinterModule {}
