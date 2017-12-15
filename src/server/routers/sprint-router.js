import express from 'express';
const router = express.Router();


import { SprintController } from '../controllers/sprint-controller';
const sprintController = new SprintController();


// Routes
router.get('/', sprintController.index);
router.post('/create', sprintController.create);


export default router;
