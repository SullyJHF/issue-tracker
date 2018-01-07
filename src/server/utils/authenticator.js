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
    /*
    switch(e.name) {
      case 'TokenExpiredError':

      break;
    }
    */
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
    role: user.role,
    fullName: `${user.firstName} ${user.surname}`
  };

  res.locals.user = req.user;

  // refresh the token
  let newToken = TokenModel.generateTokenForUser(user);

  res.cookie('token', newToken);

  next();
}

function unauthenticated(err, req, res, next) {
  console.log('NOT AUTHENTICATED:', err.name, err.message);
  res.statusCode = 401;
  res.clearCookie('token');
  req.user = undefined;
  res.locals.user = undefined;
  req.session.prevUrl = req.url;
  req.session.prevBody = req.body;

  res.redirect('/login');
}
