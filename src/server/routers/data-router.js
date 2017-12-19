import express from 'express';
const router = express.Router();


import { DataController } from '../controllers/data-controller';
const dataController = new DataController();


// Routes
router.get('/', dataController.index);
router.post('/', dataController.createColourScheme);


export default router;
