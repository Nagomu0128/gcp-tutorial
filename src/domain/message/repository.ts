import { Message, MessageRole } from "./entity";

export interface MessageRepository {
  findByConversationId(conversationId: string): Promise<Message[]>;
  create(data: {
    conversationId: string;
    role: MessageRole;
    content: string;
  }): Promise<Message>;
}
