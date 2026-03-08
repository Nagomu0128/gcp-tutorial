import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/application/auth/verify-token";
import {
  conversationRepository,
  messageRepository,
} from "@/src/infrastructure/container";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const conversation = await conversationRepository.findById(id);
  if (!conversation || conversation.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await messageRepository.findByConversationId(id);
  return NextResponse.json({ conversation, messages });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const conversation = await conversationRepository.findById(id);
  if (!conversation || conversation.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await conversationRepository.delete(id);
  return NextResponse.json({ success: true });
}
