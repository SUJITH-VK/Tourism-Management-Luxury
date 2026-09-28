import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(
  uid: string,
  email: string,
  name?: string,
  phone?: string,
  avatar?: string,
  role: string = 'customer'
) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        name,
        phone,
        avatar,
        role,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {}),
          ...(avatar ? { avatar } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to get or create user:', error);
    throw new Error('Database operation failed', { cause: error });
  }
}
