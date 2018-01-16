import express from 'express';
const router = express.Router();

import loginRouter from './login-router';
import logoutRouter from './logout-router';
import issuesRouter from './issues-router';
import employeesRouter from './employees-router';
import dataRouter from './data-router';
import sprintRouter from './sprint-router';

import { Authenticator } from '../utils/authenticator';

import { DB } from '../database';

let authenticator = new Authenticator(new DB());

// ERROR PAGES
router.get('/404', (req, res) => {
  let statusCode = 404
  res.statusCode = statusCode;
  res.render('error', { statusCode, message: 'Page not found', css: [ 'main.css' ] });
});

router.get('/500', (req, res) => {
  let statusCode = 500
  res.statusCode = statusCode;
  res.render('error', { statusCode, message: 'Internal server error', css: [ 'main.css' ] });
});

// Routes
router.get('/', (req, res) => res.redirect('/login'));
router.use('/login', loginRouter);
router.use('/logout', logoutRouter);
router.use(authenticator.authenticate);
router.use('/issues', issuesRouter);
router.use('/employees', employeesRouter);
router.use('/data', dataRouter);
router.use('/sprint', sprintRouter);

export default router;
