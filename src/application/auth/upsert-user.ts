import { adminAuth } from "@/src/infrastructure/firebase/admin";
import { userRepository } from "@/src/infrastructure/container";
import type { User } from "@/src/domain/user/entity";

export async function upsertUser(idToken: string): Promise<User> {
  const decoded = await adminAuth.verifyIdToken(idToken);
  return userRepository.upsert({
    firebaseUid: decoded.uid,
    email: decoded.email ?? "",
    displayName: decoded.name ?? null,
    photoUrl: decoded.picture ?? null,
  });
}
