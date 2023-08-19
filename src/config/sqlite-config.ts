import { DataSource } from "typeorm";
import { Account } from "../model/accounts";
import { Card } from "../model/cards";
import { Transaction } from "../model/transactions";

export const dataSource = new DataSource({
  type: "better-sqlite3",
  database: "./database.sqlite",
  synchronize: true,
  logging: true,
  entities: [Account, Transaction, Card],
  subscribers: [],
  migrations: [],
});
