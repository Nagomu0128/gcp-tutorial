import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/application/auth/verify-token";
import { conversationRepository } from "@/src/infrastructure/container";

export async function GET(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await conversationRepository.findByUserId(user.id);
  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await conversationRepository.create(user.id);
  return NextResponse.json({ conversation });
}
