import { IssueModel } from '../models/issue-model';

export class IssuesController {
  constructor() {

  }

  async index(req, res) {
    let issues = await IssueModel.getAll();

    res.render('issues', Object.assign({ css: ['main.css'] }, { issues }));
  }

  issue(req, res) {
    let id = req.params.id;

    res.redirect('/issues');
  }

  async create(req, res) {
    let issue = await IssueModel.createFromReq(req.body);
    let result = await IssueModel.insertIssue(issue);

    let id = result.id;
    res.redirect(`/issues/${id}`);
  }
}
