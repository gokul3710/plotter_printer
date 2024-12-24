import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { User } from 'src/common/decorators/user.decorator';
import { strict } from 'assert';

@Controller('printers')
export class PrinterController {
  
  constructor(private readonly printerService: PrinterService) {}

  @Get()
  @UseGuards(UserGuard)
  async getPrinters(
    @User() userId: string
  ): Promise<CreatePrinterDto[]> {
    return this.printerService.getPrinters(userId);
  }

  @Post()
  @UseGuards(UserGuard)
  async addPrinter(
    @User() userId: string ,
    @Body() createPrinterDto: CreatePrinterDto
  ): Promise<{ message: string }> {
    return this.printerService.addPrinter(createPrinterDto, userId);
  }
}