import {
  RegisterDto,
  EnableDto,
  DisableDto,
} from "../controller/interface/dto";
import { CardService } from "./interface/card.service.interface";
import cardRepository from "../repository/card.repository";
import { Card } from "../model/cards";
import accountRepository from "../repository/account.repository";
import { RegisterResponse } from "../controller/interface/response.interface";

class CardServiceImpl implements CardService {
  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const cards: Card[] = [];
    const { accountId, count } = registerDto;

    const account = await accountRepository.findById(accountId);

    for (let i = 0; i < count; i++) {
      const card = await Card.of(account);
      cards.push(card);
    }

    await cardRepository.registerMany(cards);

    const ids = cards.map((card) => card.id);
    return { ids };
  }

  async enableCard(enableDto: EnableDto): Promise<void> {
    const { cardId, accountId } = enableDto;
    const card = await cardRepository.findById(cardId);
    const account = await accountRepository.findById(accountId);

    if (card.account.id !== account.id) {
      throw new Error("Card does not belong to given account");
    }

    await cardRepository.activateCard(cardId);
  }

  async disableCard(disableDto: DisableDto): Promise<void> {
    const { cardId, accountId } = disableDto;
    const card = await cardRepository.findById(cardId);
    const account = await accountRepository.findById(accountId);

    if (card.account.id !== account.id) {
      throw new Error("Card does not belong to given account");
    }

    return cardRepository.deactivateCard(cardId);
  }
}

export default new CardServiceImpl();
