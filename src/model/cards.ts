import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transaction } from "./transactions";
import { Account } from "./accounts";

@Entity("cards")
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ nullable: false, unique: true })
  cardNumber!: string;

  @Column({ nullable: false })
  cvv!: string;

  @Column({ nullable: false })
  expiredDate!: string;

  @Column({ nullable: false, default: true })
  isActivated!: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.id, {
    nullable: true,
  })
  transactions!: Transaction[];

  @Index()
  @ManyToOne(() => Account, (account) => account.id, {
    nullable: false,
    eager: true,
  })
  account!: Account;

  private generateCardNumber(): string {
    const cardNumber = Math.floor(
      1000000000000000 + Math.random() * 9000000000000000
    ).toString();
    return cardNumber;
  }

  private generateCvv(): string {
    const cvv = Math.floor(100 + Math.random() * 900).toString();
    return cvv;
  }

  private generateExpiredDate(): string {
    const expiredDate = new Date();
    expiredDate.setFullYear(expiredDate.getFullYear() + 4);
    return expiredDate.toISOString().slice(0, 10);
  }

  public static async of(account: Account): Promise<Card> {
    const card = new Card();
    card.cardNumber = card.generateCardNumber();
    card.cvv = card.generateCvv();
    card.expiredDate = card.generateExpiredDate();
    card.isActivated = true;
    card.account = account;
    return card;
  }
}
