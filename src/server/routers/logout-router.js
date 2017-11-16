import express from 'express';
const router = express.Router();


import { LogoutController } from '../controllers/logout-controller';
const logoutController = new LogoutController();


// Routes
router.get('/', logoutController.logout);


export default router;
