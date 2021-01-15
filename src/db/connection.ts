import { createConnection } from 'typeorm';

export const connection = () => {
  createConnection().then(() => {
    return console.log("Connection to db successful");
  })
}
