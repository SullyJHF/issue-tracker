import { IssueModel } from '../models/issue-model';

export class IssuesController {
  constructor() {

  }

  index(req, res) {
    let data = {
      currentUser: {
        id: 1,
        fullName: 'Sullivan Ford'
      }
    };

    res.render('issues', Object.assign({ css: ['main.css'] }, data));
  }

  issue(req, res) {
    let id = req.params.id;

    res.redirect('/issues');
  }

  async create(req, res) {
    // do logic and add to database
    console.log(req.body);
    let issue = IssueModel.createFromReq(req.body);
    let result = await IssueModel.insertIssue(issue);
    console.log(result);

    let id = 43;
    res.redirect(`/issues/${id}`);
  }
}
