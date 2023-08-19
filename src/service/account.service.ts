import {
  CheckBalanceDto,
  CreateDto,
  DepositDto,
  VerifyDto,
  WithdrawDto,
} from "../controller/interface/dto";
import { Role } from "../constant/role.enum";
import jwt from "jsonwebtoken";
import { Card } from "../model/cards";
import { dataSource } from "../config/sqlite-config";
import { Account } from "../model/accounts";
import { Transaction } from "../model/transactions";
import accRepo from "../repository/account.repository";
import { AccountRepository } from "../repository/interface/account.repository.interface";
import { EntityManager } from "typeorm";
import {
  CreateResponse,
  VerifyResponse,
} from "../controller/interface/response.interface";
import { AccountInterface } from "./interface/account.service.interface";

const secret = "secret"; // should not use in production :O
const appId = "myapp";
const audience = "myapp_cl";

class AccountServiceImpl implements AccountInterface {
  private accountRepository: AccountRepository;
  constructor() {
    this.accountRepository = accRepo;
  }

  async create(createDto: CreateDto): Promise<CreateResponse> {
    const { phoneNumber, userName, password, firstName, lastName } = createDto;
    const [existingPhoneNumber, existingUserName] = await Promise.all([
      await this.accountRepository.findByPhoneNumber(phoneNumber),
      await this.accountRepository.findByUserName(userName),
    ]);

    if (existingPhoneNumber) {
      throw new Error("Phone number already exists");
    }
    if (existingUserName) {
      throw new Error("User name already exists");
    }

    const account = await Account.of(
      userName,
      firstName,
      lastName,
      phoneNumber,
      password
    );

    await this.accountRepository.create(account);

    const token = jwt.sign(
      {
        sub: account.id,
        name: account.id,
        iat: Date.now(),
        exp: Date.now() + 1000 * 60 * 60,
        iss: appId,
        aud: audience,
        roles: [Role.USER],
      },
      secret
    );

    return { token, id: account.id };
  }

  async verify(verifyDto: VerifyDto): Promise<VerifyResponse> {
    const { userName, password } = verifyDto;

    const account = await this.accountRepository.findByUserName(userName);

    if (!account) {
      throw new Error("User not found");
    }

    const isPasswordValid = await account.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Password is invalid");
    }

    const token = jwt.sign(
      {
        sub: account.id,
        name: account.id,
        iat: Date.now(),
        exp: Date.now() + 1000 * 60 * 60,
        iss: appId,
        aud: audience,
        roles: [Role.USER],
      },
      secret
    );

    return { token, id: account.id };
  }

  async withdraw(withdrawDto: WithdrawDto): Promise<void> {
    const { id, amount, cardId } = withdrawDto;
    let card: Card;
    await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
      if (cardId) {
        card = await getValidatedCard(cardId, id, entityManager);
      }

      const account = await entityManager.findOneOrFail(Account, {
        where: { id },
      });

      if (account.balance < amount) {
        throw new Error("Not enough balance");
      }

      if (amount > account.withdrawalWarningThresh) {
        // send warning email
      }

      account.balance -= amount;
      await entityManager.save(account);
      await entityManager.getRepository(Transaction).save({
        amount,
        type: "withdraw",
        account,
        card: card || undefined,
      });
    });
  }

  async deposit(depositDto: DepositDto): Promise<void> {
    const { id, amount, cardId } = depositDto;
    let card: Card;
    await dataSource.transaction("SERIALIZABLE", async (entityManager) => {
      if (cardId) {
        card = await getValidatedCard(cardId, id, entityManager);
      }

      const account = await entityManager.findOneOrFail(Account, {
        where: { id },
      });

      account.balance += amount;
      await entityManager.save(account);
      await entityManager.getRepository(Transaction).save({
        amount,
        type: "deposit",
        account,
        card: card || undefined,
      });
    });
  }

  async checkBalance(checkBalanceDto: CheckBalanceDto): Promise<number> {
    const { id } = checkBalanceDto;
    return await this.accountRepository.checkBalance(id);
  }
}

const getValidatedCard = async (
  cardId: string,
  accountId: string,
  entityManager: EntityManager
): Promise<Card> => {
  const card = await entityManager.findOneOrFail(Card, {
    where: { id: cardId },
  });
  if (!card.isActivated) {
    throw new Error("Card is not activated");
  }
  if (card.account.id !== accountId) {
    throw new Error("Card does not belong to this account");
  }
  return card;
};

export default new AccountServiceImpl();
