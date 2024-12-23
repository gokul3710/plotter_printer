import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Printer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  user_id: string;

  @Column()
  connectionType: string;

  @Column()
  connectionDetail: string;
}
