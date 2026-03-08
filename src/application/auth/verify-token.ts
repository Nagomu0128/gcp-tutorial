import { NextRequest } from "next/server";
import { adminAuth } from "@/src/infrastructure/firebase/admin";
import { userRepository } from "@/src/infrastructure/container";
import type { User } from "@/src/domain/user/entity";

export async function verifyToken(req: NextRequest): Promise<User | null> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return await userRepository.findByFirebaseUid(decoded.uid);
  } catch {
    return null;
  }
}
