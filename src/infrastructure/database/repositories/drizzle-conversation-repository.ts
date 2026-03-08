import { eq, desc } from "drizzle-orm";
import { db } from "../client";
import { conversations } from "../schema";
import type { Conversation } from "@/src/domain/conversation/entity";
import type { ConversationRepository } from "@/src/domain/conversation/repository";

export class DrizzleConversationRepository implements ConversationRepository {
  async findById(id: string): Promise<Conversation | null> {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);
    return conv ?? null;
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    return db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  }

  async create(userId: string, title = "New Chat"): Promise<Conversation> {
    const [conv] = await db
      .insert(conversations)
      .values({ userId, title })
      .returning();
    return conv;
  }

  async updateTitle(id: string, title: string): Promise<void> {
    await db
      .update(conversations)
      .set({ title, updatedAt: new Date() })
      .where(eq(conversations.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(conversations).where(eq(conversations.id, id));
  }
}
