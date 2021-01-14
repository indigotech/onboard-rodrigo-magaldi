import { hash, compare } from 'bcryptjs'


export const generateHash = (payload: string): Promise<string> => {
  return hash(payload, 10);
}

export const compareHash = (payload: string, hashed: string): Promise<boolean> => {
  return compare(payload, hashed);
}
