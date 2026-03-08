import type { DocumentChunkRepository } from "@/src/domain/document/repository";
import { generateEmbedding } from "./gemini-embeddings";

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function retrieveRelevantChunks(
  chunkRepository: DocumentChunkRepository,
  query: string,
  userId: string,
  topK = 5
): Promise<string[]> {
  const queryEmbedding = await generateEmbedding(query);
  const chunks = await chunkRepository.findByUserId(userId);

  if (chunks.length === 0) return [];

  const scored = chunks.map((chunk) => ({
    content: chunk.content,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.content);
}
