import express from 'express';
const router = express.Router();


import { IssuesController } from '../controllers/issues-controller';
const issuesController = new IssuesController();


// Routes
router.get('/', issuesController.index);
router.get('/:id', issuesController.issue);
router.post('/:id/log', issuesController.log);
router.post('/:id/resolve', issuesController.resolve);
router.post('/:id/close', issuesController.close);
router.post('/:id/toggleProgress', issuesController.toggleProgress);
router.post('/create', issuesController.create)


export default router;
