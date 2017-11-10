import express from 'express';
const router = express.Router();


import { LoginController } from '../controllers/login-controller';
const loginController = new LoginController();


// Routes
router.post('/', loginController.login);


export default router;
