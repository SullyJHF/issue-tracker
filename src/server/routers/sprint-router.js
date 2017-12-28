import express from 'express';
const router = express.Router();


import { SprintController } from '../controllers/sprint-controller';
const sprintController = new SprintController();


// Routes
router.get('/', sprintController.index);
router.use(sprintController.checkRole.bind(sprintController));
router.post('/', sprintController.create);


export default router;
