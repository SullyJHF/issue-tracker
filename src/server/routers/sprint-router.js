import express from 'express';
const router = express.Router();


import { DB } from '../database';
import { SprintController } from '../controllers/sprint-controller';
const sprintController = new SprintController(new DB());


// Routes
router.get('/', sprintController.index);
router.use(sprintController.checkRole.bind(sprintController));
router.post('/', sprintController.create);


export default router;
