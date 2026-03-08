import { DrizzleUserRepository } from "./database/repositories/drizzle-user-repository";
import { DrizzleConversationRepository } from "./database/repositories/drizzle-conversation-repository";
import { DrizzleMessageRepository } from "./database/repositories/drizzle-message-repository";
import {
  DrizzleDocumentRepository,
  DrizzleDocumentChunkRepository,
} from "./database/repositories/drizzle-document-repository";

// Simple DI container — single source of repository instances
export const userRepository = new DrizzleUserRepository();
export const conversationRepository = new DrizzleConversationRepository();
export const messageRepository = new DrizzleMessageRepository();
export const documentRepository = new DrizzleDocumentRepository();
export const documentChunkRepository = new DrizzleDocumentChunkRepository();
