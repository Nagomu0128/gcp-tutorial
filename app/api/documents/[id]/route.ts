import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/src/application/auth/verify-token";
import { deleteDocument } from "@/src/application/document/delete-document";
import { documentRepository } from "@/src/infrastructure/container";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const doc = await documentRepository.findById(id);
  if (!doc || doc.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteDocument(id);
  return NextResponse.json({ success: true });
}
