import express from 'express';
const router = express.Router();


import { DB } from '../database';
import { DataController } from '../controllers/data-controller';
const dataController = new DataController(new DB());



// Routes
router.use(dataController.checkRole.bind(dataController));
router.get('/', dataController.index);
router.post('/', dataController.createColourScheme);


export default router;
