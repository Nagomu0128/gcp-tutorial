import { User } from "./entity";

export interface UserRepository {
  findByFirebaseUid(uid: string): Promise<User | null>;
  upsert(data: {
    firebaseUid: string;
    email: string;
    displayName: string | null;
    photoUrl: string | null;
  }): Promise<User>;
}
