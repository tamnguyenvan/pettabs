// src/lib/user.ts
import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'pettabs_user_id';

export function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}