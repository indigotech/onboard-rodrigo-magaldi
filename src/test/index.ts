import 'reflect-metadata';
import { setup } from 'setup-server';
before(async () => {
  await setup();
});

require('test/login.test.ts');
require('test/create-user.test.ts');
