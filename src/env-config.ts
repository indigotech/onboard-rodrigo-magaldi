import dotenv from 'dotenv';

export function envConfig() {
  console.log(process.env.ENV);

  if (process.env.ENV === 'dev') {
    dotenv.config({ path: '.env' });
  } else if (process.env.ENV === 'test') {
    dotenv.config({ path: '.env.test' });
  }
}
