import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Address } from 'entity/address';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  birthDate: string;

  @Column()
  cpf: string;

  @Column()
  password: string;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}
