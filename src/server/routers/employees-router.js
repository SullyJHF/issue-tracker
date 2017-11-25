import express from 'express';
const router = express.Router();


import { EmployeesController } from '../controllers/employees-controller';
const employeesController = new EmployeesController();


// Routes
router.get('/', employeesController.index);
router.post('/create', employeesController.create);
router.post('/teams/create', employeesController.createTeam);
router.post('/tiers/create', employeesController.createTier);


export default router;
