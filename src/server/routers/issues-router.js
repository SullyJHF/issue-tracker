import express from 'express';
const router = express.Router();


import { DB } from '../database';
import { IssuesController } from '../controllers/issues-controller';
const issuesController = new IssuesController(new DB());


// Routes
router.get('/', issuesController.index);
router.post('/', issuesController.create);
router.get('/:id*', issuesController.issue);
router.use('/:id', issuesController.checkUser);
router.post('/:id/log', issuesController.log);
router.post('/:id/log/edit', issuesController.editLog);
router.post('/:id/resolve', issuesController.resolve);
router.post('/:id/close', issuesController.close);
router.post('/:id/toggleProgress', issuesController.toggleProgress);
router.post('/:id/removeLog', issuesController.removeLog);
// Using post here because DELETE is not supported in html forms yet
router.post('/:id/delete', issuesController.deleteIssue);


export default router;
