import 'babel-polyfill';
import test from 'tape';

import './issue-model';

import { TokenModel } from '../src/server/models/token-model';
import { UserModel } from '../src/server/models/user-model';

test('TokenModel.generateTokenForUser', (subTest) => {
  subTest.test(' > Invalid user object', (t) => {
    t.plan(1);
    let user = {};
    try {
      TokenModel.generateTokenForUser(user);
    } catch(err) {
      t.deepEqual(err, new Error('Data must be of type UserModel'), 'Error should be thrown');
    }
  });

  subTest.test(' > Happy path', (t) => {
    t.plan(1);
    let user = new UserModel(1, null, 'hashedPass', null, null, null, null, null, null);
    t.equal(typeof TokenModel.generateTokenForUser(user), 'string', 'Token should be a string');
  });
});

