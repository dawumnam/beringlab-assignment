import { AccountRepository } from "./interface/account.repository.interface";
import { Account } from "../model/accounts";
import { dataSource } from "../config/sqlite-config";

class AccountRepositoryImpl implements AccountRepository {
  async create(account: Account): Promise<void> {
    await dataSource.getRepository(Account).save(account);
  }

  async findById(id: string): Promise<Account> {
    return await dataSource.getRepository(Account).findOneByOrFail({ id });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Account | null> {
    return await dataSource.manager.findOneBy(Account, { phoneNumber });
  }

  async findByUserName(userName: string): Promise<Account | null> {
    return await dataSource.getRepository(Account).findOneBy({ userName });
  }

  async checkBalance(id: string): Promise<number> {
    const account = await dataSource
      .getRepository(Account)
      .findOneByOrFail({ id });
    return account.balance;
  }
}

export default new AccountRepositoryImpl();
