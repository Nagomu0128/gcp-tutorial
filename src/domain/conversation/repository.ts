import { Conversation } from "./entity";

export interface ConversationRepository {
  findById(id: string): Promise<Conversation | null>;
  findByUserId(userId: string): Promise<Conversation[]>;
  create(userId: string, title?: string): Promise<Conversation>;
  updateTitle(id: string, title: string): Promise<void>;
  delete(id: string): Promise<void>;
}
