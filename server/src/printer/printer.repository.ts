import { DatabaseService } from "src/database/database.service";
import { CreatePrinterDto } from "src/printer/dto/create-printer.dto";

export class PrinterRepository {

    constructor(private databaseService: DatabaseService) {}

    async findAll() {
        return this.databaseService.db.all('SELECT * FROM printers');
    }

    async findOne({id, name, user_id}: {id?: number, name?: string, user_id?: string}) {

        if (user_id) {
            return this.databaseService.db.get('SELECT * FROM printers WHERE user_id = ?', user_id);
        }

        if (name) {
            return this.databaseService.db.get('SELECT * FROM printers WHERE name = ?', name);
        }
        
        return this.databaseService.db.get('SELECT * FROM printers WHERE id = ?', id);
    }

    async save(printer: CreatePrinterDto) {
        return this.databaseService.db.run(
            'INSERT INTO printers (name, connectionType, connectionDetail, user_id) VALUES (?, ?, ?, ?)',
            printer.name,
            printer.connectionType,
            printer.connectionDetail,
            "user_id"
        );
    }

}
