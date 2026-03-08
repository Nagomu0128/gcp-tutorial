import { eq } from "drizzle-orm";
import { db } from "../client";
import { users } from "../schema";
import type { User } from "@/src/domain/user/entity";
import type { UserRepository } from "@/src/domain/user/repository";

export class DrizzleUserRepository implements UserRepository {
  async findByFirebaseUid(uid: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, uid))
      .limit(1);
    return user ?? null;
  }

  async upsert(data: {
    firebaseUid: string;
    email: string;
    displayName: string | null;
    photoUrl: string | null;
  }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(data)
      .onConflictDoUpdate({
        target: users.firebaseUid,
        set: {
          email: data.email,
          displayName: data.displayName,
          photoUrl: data.photoUrl,
        },
      })
      .returning();
    return user;
  }
}
