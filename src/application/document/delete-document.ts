import {
  documentRepository,
  documentChunkRepository,
} from "@/src/infrastructure/container";

export async function deleteDocument(id: string) {
  await documentChunkRepository.deleteByDocumentId(id);
  await documentRepository.delete(id);
}
