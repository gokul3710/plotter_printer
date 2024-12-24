import { Injectable } from '@nestjs/common';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Printer } from './printer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrinterService {

  constructor(
    @InjectRepository(Printer)
    private readonly printerRepository: Repository<Printer>,
  ) {}

  async addPrinter(printerDto: CreatePrinterDto, userId: string): Promise<any> {
    console.log({printerDto, userId});
    const printer = this.printerRepository.create({...printerDto, userId});
    return await this.printerRepository.save(printer);
  }

  async getPrinters(userId?: string): Promise<Printer[]> {
    let printers = await this.printerRepository.find({
      where: {
        userId: userId
      }
    });
    return printers;
  }
}
