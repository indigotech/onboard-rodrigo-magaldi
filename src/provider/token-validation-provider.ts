import jwt from 'jsonwebtoken';

export function isTokenValid(token: string): boolean {
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    return Date.now() < verified['exp'] * 1000;
  } catch (err) {
    return false;
  }
}
