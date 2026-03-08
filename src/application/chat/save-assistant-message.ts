import { messageRepository, conversationRepository } from "@/src/infrastructure/container";

export async function saveAssistantMessage(
  conversationId: string,
  content: string
) {
  await messageRepository.create({
    conversationId,
    role: "assistant",
    content,
  });
  // Touch updatedAt
  const conv = await conversationRepository.findById(conversationId);
  if (conv) {
    await conversationRepository.updateTitle(conv.id, conv.title);
  }
}
