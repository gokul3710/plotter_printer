import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Database, open } from 'sqlite';
import * as sqlite3 from 'sqlite3';
import { CreatePrinterDto } from './dto/create-printer.dto';

@Injectable()
export class PrinterService {
  private db: Database;

  async initializeDatabase() {
    this.db = await open({
      filename: join(__dirname, 'printers.db'),
      driver: sqlite3.Database,
    });

    await this.db.exec(`CREATE TABLE IF NOT EXISTS printers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      connectionType TEXT NOT NULL,
      connectionDetail TEXT NOT NULL
    )`);
  }

  async addPrinter(printer: CreatePrinterDto): Promise<void> {
    await this.db.run(
      'INSERT INTO printers (name, connectionType, connectionDetail) VALUES (?, ?, ?)',
      printer.name,
      printer.connectionType,
      printer.connectionDetail,
    );
  }

  async getPrinters(): Promise<CreatePrinterDto[]> {
    return this.db.all('SELECT * FROM printers');
  }
}
