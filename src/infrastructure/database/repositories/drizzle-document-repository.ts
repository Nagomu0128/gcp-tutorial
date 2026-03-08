import { eq } from "drizzle-orm";
import { db } from "../client";
import { documents, documentChunks } from "../schema";
import type { Document, DocumentChunk } from "@/src/domain/document/entity";
import type {
  DocumentRepository,
  DocumentChunkRepository,
} from "@/src/domain/document/repository";

export class DrizzleDocumentRepository implements DocumentRepository {
  async findByUserId(userId: string): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.userId, userId));
  }

  async findById(id: string): Promise<Document | null> {
    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);
    return doc ?? null;
  }

  async create(data: {
    userId: string;
    filename: string;
    content: string;
  }): Promise<Document> {
    const [doc] = await db.insert(documents).values(data).returning();
    return doc;
  }

  async delete(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }
}

export class DrizzleDocumentChunkRepository implements DocumentChunkRepository {
  async findByUserId(userId: string): Promise<DocumentChunk[]> {
    const rows = await db
      .select()
      .from(documentChunks)
      .where(eq(documentChunks.userId, userId));
    return rows.map((r) => ({
      ...r,
      embedding: JSON.parse(r.embedding),
    }));
  }

  async createMany(
    chunks: {
      documentId: string;
      userId: string;
      content: string;
      embedding: number[];
      chunkIndex: number;
    }[]
  ): Promise<void> {
    if (chunks.length === 0) return;
    await db.insert(documentChunks).values(
      chunks.map((c) => ({
        ...c,
        embedding: JSON.stringify(c.embedding),
      }))
    );
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    await db
      .delete(documentChunks)
      .where(eq(documentChunks.documentId, documentId));
  }
}
