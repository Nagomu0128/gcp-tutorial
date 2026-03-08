import {
  documentRepository,
  documentChunkRepository,
} from "@/src/infrastructure/container";
import { splitIntoChunks } from "@/src/infrastructure/ai/chunker";
import { generateEmbeddings } from "@/src/infrastructure/ai/gemini-embeddings";

export async function uploadDocument(
  userId: string,
  filename: string,
  content: string
) {
  const doc = await documentRepository.create({ userId, filename, content });

  const chunks = splitIntoChunks(content);
  const embeddings = await generateEmbeddings(chunks);

  await documentChunkRepository.createMany(
    chunks.map((text, i) => ({
      documentId: doc.id,
      userId,
      content: text,
      embedding: embeddings[i],
      chunkIndex: i,
    }))
  );

  return doc;
}
