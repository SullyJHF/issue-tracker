import express from 'express';
const router = express.Router();

import loginRouter from './login-router';
import issuesRouter from './issues-router';

router.get('/', (req, res) => {
  res.render('login', { title: 'login page', css: ['main.css'] });
});


// Routes
router.use('/login', loginRouter);
router.use('/issues', issuesRouter);


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

export default router;
