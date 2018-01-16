import express from 'express';
const router = express.Router();


import { DB } from '../database';
import { EmployeesController } from '../controllers/employees-controller';
const employeesController = new EmployeesController(new DB());


// Routes
router.use(employeesController.checkUser.bind(employeesController));
router.get('/', employeesController.index);
router.post('/create', employeesController.create);
router.post('/edit', employeesController.edit);
router.post('/teams/create', employeesController.createTeam);
router.post('/tiers/create', employeesController.createTier);
router.get('*', employeesController.index);


export default router;
