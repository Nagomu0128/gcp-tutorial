import { NextRequest } from "next/server";
import { verifyToken } from "@/src/application/auth/verify-token";
import { sendMessage } from "@/src/application/chat/send-message";
import { saveAssistantMessage } from "@/src/application/chat/save-assistant-message";

export async function POST(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { conversationId, message } = await req.json();
  if (!conversationId || !message) {
    return new Response("Missing fields", { status: 400 });
  }

  const result = await sendMessage(conversationId, user.id, message);

  // Collect full text for saving, then return stream
  let fullText = "";
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of result.textStream) {
        fullText += chunk;
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
      // Save complete assistant response
      await saveAssistantMessage(conversationId, fullText);
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
