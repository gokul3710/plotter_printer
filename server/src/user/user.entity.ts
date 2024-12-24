import { Optional } from '@nestjs/common';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    generated: 'uuid'
  })
  userId: string;

  @Column({
    type: 'varchar'
  })
  email: string;

  @Column({
    type: 'varchar'
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  clientId: string;
}
