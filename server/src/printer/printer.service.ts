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

  async addPrinter(printerDto: CreatePrinterDto, user_id?: string): Promise<any> {
    const printer = this.printerRepository.create({...printerDto, user_id});
    return await this.printerRepository.save(printer);
  }

  async getPrinters(): Promise<Printer[]> {
    let printers = await this.printerRepository.find();
    return printers;
  }
}
