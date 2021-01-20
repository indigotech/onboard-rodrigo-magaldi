import { sign } from 'jsonwebtoken';

export function generateToken(id: any, rememberMe: boolean) {
  const token = sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? process.env.JWT_REMEMBER_ME_EXPIRATION : process.env.JWT_EXPIRATION,
  });
  return token;
}
