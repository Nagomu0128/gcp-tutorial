export interface Document {
  id: string;
  userId: string;
  filename: string;
  content: string;
  createdAt: Date;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  userId: string;
  content: string;
  embedding: number[];
  chunkIndex: number;
}
