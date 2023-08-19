import { Card } from "../model/cards";
import { CardRepository } from "./interface/card.repository.interface";
import { dataSource } from "../config/sqlite-config";

class CardRepositoryImpl implements CardRepository {
  async register(card: Card): Promise<void> {
    await dataSource.getRepository(Card).save(card);
  }

  async registerMany(cards: Card[]): Promise<void> {
    await dataSource.getRepository(Card).save(cards);
  }

  async findById(id: string): Promise<Card> {
    return await dataSource.getRepository(Card).findOneByOrFail({ id });
  }

  async activateCard(id: string): Promise<void> {
    await dataSource.getRepository(Card).update(id, { isActivated: true });
  }

  async deactivateCard(id: string): Promise<void> {
    await dataSource.getRepository(Card).update(id, { isActivated: false });
  }
}

export default new CardRepositoryImpl();
