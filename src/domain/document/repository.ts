import { Document, DocumentChunk } from "./entity";

export interface DocumentRepository {
  findByUserId(userId: string): Promise<Document[]>;
  findById(id: string): Promise<Document | null>;
  create(data: {
    userId: string;
    filename: string;
    content: string;
  }): Promise<Document>;
  delete(id: string): Promise<void>;
}

export interface DocumentChunkRepository {
  findByUserId(userId: string): Promise<DocumentChunk[]>;
  createMany(
    chunks: {
      documentId: string;
      userId: string;
      content: string;
      embedding: number[];
      chunkIndex: number;
    }[]
  ): Promise<void>;
  deleteByDocumentId(documentId: string): Promise<void>;
}
