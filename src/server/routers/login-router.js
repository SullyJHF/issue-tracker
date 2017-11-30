import express from 'express';
const router = express.Router();


import { LoginController } from '../controllers/login-controller';
const loginController = new LoginController();


// Routes
router.get('/', loginController.index);
router.post('/', loginController.login.bind(loginController));


export default router;
