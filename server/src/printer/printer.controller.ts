import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { CreatePrinterDto } from './dto/create-printer.dto';

@Controller('printers')
export class PrinterController {
  constructor(private readonly printerService: PrinterService) {}

  @Post()
  async addPrinter(@Body() createPrinterDto: CreatePrinterDto): Promise<{ message: string }> {
    await this.printerService.addPrinter(createPrinterDto);
    return { message: 'Printer added successfully' };
  }

  @Get()
  async getPrinters(): Promise<CreatePrinterDto[]> {
    return this.printerService.getPrinters();
  }
}