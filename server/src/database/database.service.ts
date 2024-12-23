import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import { Database, open } from 'sqlite';
import * as sqlite3 from 'sqlite3';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private database: Database;

    async onModuleInit() {
        await this.initializeDatabase();
    }

    private async initializeDatabase() {
        this.database = await open({
            filename: join('./', 'printers.db'),
            driver: sqlite3.Database,
        });

        await this.database.exec(`CREATE TABLE IF NOT EXISTS printers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      connectionType TEXT NOT NULL,
      connectionDetail TEXT NOT NULL,
      user_id TEXT NOT NULL
    )`);

        await this.database.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        passwords TEXT NOT NULL
    )`);
    }

    get db(): Database {
        if(this.database === undefined) {
            this.initializeDatabase()
        }
        return this.database;
    }

    createQuery(data: any) {

        let keys = ""
        let values = ""

        for (let key in data) {
            keys += key + ","
            values += data[key] + ","
        }

        return `(${keys}) VALUES (${values})`
    }

    async save(table: string, data: any) {
        const query = this.createQuery(data)
        return this.database.run(`INSERT INTO ${table} ${query}`);
    }
}
