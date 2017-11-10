import express from 'express';
const router = express.Router();

import loginRouter from './login-router';

router.get('/', (req, res) => {
  res.render('login', { title: 'login page', css: ['main.css'] });
});


// Routes
router.use('/login', loginRouter);


// ERROR PAGES
router.get('/404', (req, res) => {
  res.statusCode = 404;
  res.render('404');
});

router.get('/500', (req, res) => {
  res.statusCode = 500;
  res.render('500');
});

export default router;
