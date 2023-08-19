import { Account } from "../../model/accounts";

export interface AccountRepository {
  create(account: Account): Promise<void>;
  findById(id: string): Promise<Account>;
  findByPhoneNumber(phoneNumber: string): Promise<Account | null>;
  findByUserName(userName: string): Promise<Account | null>;
  checkBalance(id: string): Promise<number>;
}
