import { IssueModel } from '../models/issue-model';

export class IssuesController {
  constructor() {

  }

  index(req, res) {
    let user = req.user;

    res.render('issues', Object.assign({ css: ['main.css'] }, { user }));
  }

  issue(req, res) {
    let id = req.params.id;

    res.redirect('/issues');
  }

  async create(req, res) {
    // do logic and add to database
    console.log(req.body);
    let issue = await IssueModel.createFromReq(req.body);
    let result = await IssueModel.insertIssue(issue);
    console.log(result);

    let id = 43;
    res.redirect(`/issues/${id}`);
  }
}
