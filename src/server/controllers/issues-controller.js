import { IssueModel } from '../models/issue-model';
import { IssueState } from '../utils/issue-state'

export class IssuesController {
  constructor() {

  }

  async index(req, res) {
    let issues = await IssueModel.getAll();

    res.render('issues', Object.assign({ css: ['main.css'] }, { issues }));
  }

  async issue(req, res) {
    let issue = await IssueModel.getById(req.params.id);

    res.render('issue', { css: ['main.css'], issue });
  }

  async create(req, res) {
    let issue = await IssueModel.createFromReq(req.body);
    let result = await IssueModel.insertIssue(issue);

    let id = result.id;
    res.redirect(`/issues/${id}`);
  }

  async toggleProgress(req, res) {
    let issue = await IssueModel.getById(req.params.id);
    
    issue.state = issue.state === IssueState.AWAITING_START ? IssueState.IN_PROGRESS : IssueState.AWAITING_START;

    try {
      issue = await IssueModel.updateIssue(issue);
    } catch (e) {
      console.error(e);
    }

    res.redirect(`/issues/${req.params.id}`);
  }
}
