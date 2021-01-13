import { createConnection } from 'typeorm';

createConnection().then(() => {
  return console.log("Connection to db successful");
});
