import express from 'express';
const router = express.Router();


import { EmployeesController } from '../controllers/employees-controller';
const employeesController = new EmployeesController();


// Routes
router.get('/', employeesController.index);


export default router;
