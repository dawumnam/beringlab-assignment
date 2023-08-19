import { Card } from "../../model/cards";

export interface CardRepository {
  register(card: Card): Promise<void>;
  registerMany(cards: Card[]): Promise<void>;
  findById(id: string): Promise<Card>;
  activateCard(id: string): Promise<void>;
  deactivateCard(id: string): Promise<void>;
}
