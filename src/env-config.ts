import dotenv from 'dotenv';

export function envConfig() {
  dotenv.config({ path: process.env.ENV === 'test' ? '.env.test' : '.env' });
}
