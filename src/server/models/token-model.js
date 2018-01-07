import jwt from 'jsonwebtoken';
import config from '../config';

import { UserModel } from './user-model';

export class TokenModel {
  constructor() {}

  static generateTokenForUser(user) {
    if (!(user instanceof UserModel)) throw new Error('Data must be of type UserModel');

    let payload = {
      id: user.id,
      hashedPass: user.hashedPass
    }

    let token = jwt.sign(payload, config().secret, { expiresIn: '1h' });

    return token;
  }
}
