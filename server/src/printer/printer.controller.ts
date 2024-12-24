import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserGuard } from 'src/common/guards/user.guard';

@Controller('printers')
export class PrinterController {
  constructor(private readonly printerService: PrinterService) {}

  @Post()
  @UseGuards(UserGuard)
  async addPrinter(
    @User() userId: string ,
    @Body() createPrinterDto: CreatePrinterDto
  ): Promise<{ message: string }> {
    console.log({userId});
    await this.printerService.addPrinter(createPrinterDto);
    return { message: 'Printer added successfully' };
  }

  @Get()
  async getPrinters(): Promise<CreatePrinterDto[]> {
    return this.printerService.getPrinters();
  }
}