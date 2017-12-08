import config from '../config';
import jwt from 'jsonwebtoken';

import { UserModel } from '../models/user-model';
import { TokenModel } from '../models/token-model';

export default async function authenticator(req, res, next) {
  console.log('AUTHENTICATING');
  let token;

  try {
    token = jwt.verify(req.cookies.token, config().secret);
  } catch(e) {
    console.error(e);
    // do this switch for each error and handle accordingly?
    /*switch(e.name) {
      case 'TokenExpiredError':

      break;
    }*/
    unauthenticated(e.message, req, res, next);
    return;
  }

  // Check if user exists
  // correct admin rights
  // token validity (expired)
  // if password hash is the same (if they've changed their password)
  let user = await UserModel.getById(token.id);

  if (!user) {
    // User doesn't exist
    return unauthenticated('User not found', req, res, next);
  }

  if (token.hashedPass !== user.hashedPass) {
    // User changed password since - unauthenticated
    return unauthenticated('User changed password', req, res, next);
  }

  // do this when user role is implemented
  // res.statusCode = 403; // forbidden
  req.user = {
    id: user.id,
    role: 0, // set as actual user role
    fullName: `${user.firstName} ${user.surname}`
  };

  // refresh the token
  let newToken = TokenModel.generateTokenForUser(user);

  res.cookie('token', newToken);

  next();
}

function unauthenticated(err, req, res, next) {
  console.log('NOT AUTHENTICATED:', err);
  res.statusCode = 401;
  // redirect back to login?
  // or explain to user that unauthenticated
  // send back some data to display on the current page?
  res.redirect('/login');
}
