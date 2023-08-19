import * as bcrypt from "bcrypt";
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transaction } from "./transactions";
import { Card } from "./cards";
import { DEFAULT_WITHDRAWAL_WARNING_THRESH } from "../constant/threshhold.constant";

@Entity("accounts")
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ unique: true, nullable: false })
  userName!: string;

  @Column({ nullable: false })
  firstName!: string;

  @Column({ nullable: false })
  lastName!: string;

  @Column({ nullable: false, default: DEFAULT_WITHDRAWAL_WARNING_THRESH })
  withdrawalWarningThresh!: number;

  @Column({ nullable: false })
  accountNumber!: string;

  @Index()
  @Column({ unique: true, nullable: false })
  phoneNumber!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ default: 0, type: "int" })
  balance!: number;

  @Column({
    nullable: false,
    default: "checking",
  })
  type!: string; // 'saving' or 'checking'

  @Column({ nullable: false, default: true })
  isActive!: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.account, {
    cascade: true,
  })
  transactions!: Transaction[];

  @OneToMany(() => Card, (card) => card.account, { cascade: true })
  cards!: Card[];

  async encryptPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  async generateAccountNumber(): Promise<string> {
    const accountNumber = Math.floor(
      1000000000000000 + Math.random() * 9000000000000000
    ).toString();
    return accountNumber;
  }

  public static async of(
    userName: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    password: string
  ): Promise<Account> {
    const account = new Account();
    account.userName = userName;
    account.firstName = firstName;
    account.lastName = lastName;
    account.phoneNumber = phoneNumber;
    account.password = password;
    account.accountNumber = await account.generateAccountNumber();
    await account.encryptPassword();
    return account;
  }
}
