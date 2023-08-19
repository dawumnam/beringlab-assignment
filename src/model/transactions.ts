import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  Index,
} from "typeorm";
import { Account } from "./accounts";
import { Card } from "./cards";

@Entity("transactions")
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ nullable: false })
  amount!: number;

  @Index()
  @Column({ nullable: false })
  type!: string;

  @Index()
  @ManyToOne(() => Account, (account) => account.id)
  account!: Account;

  @Index()
  @ManyToOne(() => Card, (card) => card.id, { nullable: true })
  card!: Card;

  public static async of(
    amount: number,
    type: string,
    account: Account,
    card?: Card
  ): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.type = type;
    transaction.account = account;
    if (card) {
      transaction.card = card;
    }
    return transaction;
  }
}
