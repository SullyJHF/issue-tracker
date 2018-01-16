import express from 'express';
const router = express.Router();


import { DB } from '../database';
import { LoginController } from '../controllers/login-controller';
const loginController = new LoginController(new DB());


// Routes
router.get('/', loginController.index);
router.post('/', loginController.login.bind(loginController));


export default router;
