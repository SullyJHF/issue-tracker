import express from 'express';
const router = express.Router();


import { IssuesController } from '../controllers/issues-controller';
const issuesController = new IssuesController();


// Routes
router.get('/', issuesController.index);
router.get('/:id', issuesController.issue);
router.post('/create', issuesController.create)


export default router;
