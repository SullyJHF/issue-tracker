import { IssueModel } from '../models/issue-model';
import { UserModel } from '../models/user-model';
import { ColourSchemeModel } from '../models/colour-scheme-model';

import { IssueState } from '../utils/issue-state';

export class IssuesController {
  constructor() {}

  async index(req, res) {
    let user = await UserModel.getById(req.user.id);
    let issues;
    if (req.user.role > 0) {
      issues = await IssueModel.getAll();
    } else {
      issues = await IssueModel.getByTeamId(user.team.id);
    }
    let colours = await ColourSchemeModel.getByEmpId(req.user.id);
    let formData = req.body.formData || req.session.prevBody || {};

    res.render('issues', { css: ['main.css'], issues, colours, formData });
    req.session.destroy();
  }

  async issue(req, res) {
    let issue = await IssueModel.getById(req.params.id);
    if (req.user.role < 1) {
      let user = await UserModel.getById(req.user.id);
      let teamIssues = await IssueModel.getByTeamId(user.team.id);
      if(!teamIssues.find((i) => i.id === issue.id)) {
        // issue not in current user's team
        res.redirect('/issues');
        return;
      }
    }
    let formData = req.body.formData || req.session.prevBody || {};

    res.render('issue', { css: ['main.css'], issue, formData });
    req.session.destroy();
  }

  async create(req, res) {
    let issue = await IssueModel.createFromReq(req.body);
    let result = await IssueModel.insertIssue(issue);

    let id = result.id;
    res.redirect(`/issues/${id}`);
  }

  async log(req, res) {
    let issue = await IssueModel.getById(req.params.id);
    let timeStr = req.body.time;

    let result = await IssueModel.logTime(issue, timeStr);

    res.redirect(`/issues/${issue.id}`);
  }

  async removeLog(req, res) {
    let issueId = req.params.id;
    let sprintId = req.body.logSprint;
    let time = req.body.logTime;

    let result = await IssueModel.removeWorkLog(issueId, sprintId, time);
    res.redirect(`/issues/${issueId}`);
  }

  async editLog(req, res) {
    let issueId = req.params.id;
    let sprintId = req.body.editLogSprint;
    let time = req.body.editLogTime;
    let oldTime = req.body.editLogOldTime;

    let result = await IssueModel.editWorkLog(issueId, sprintId, time, oldTime);

    res.redirect(`/issues/${issueId}`);
  }

  async resolve(req, res) {
    let issue = await IssueModel.getById(req.params.id);
    issue.state = IssueState.RESOLVED;

    let result = await IssueModel.updateIssue(issue);

    res.redirect(`/issues/${issue.id}`);
  }

  async close(req, res) {
    let issue = await IssueModel.getById(req.params.id);
    issue.state = IssueState.CLOSED;

    let result = await IssueModel.updateIssue(issue);

    res.redirect(`/issues/${issue.id}`);
  }

  async toggleProgress(req, res) {
    let issue = await IssueModel.getById(req.params.id);

    issue.state = issue.state !== IssueState.IN_PROGRESS ? IssueState.IN_PROGRESS : IssueState.AWAITING_START;

    try {
      issue = await IssueModel.updateIssue(issue);
    } catch (e) {
      console.error(e);
    }

    res.redirect(`/issues/${req.params.id}`);
  }

  async checkUser(req, res, next) {
    if (req.user.role > 0) return next();
    
    let issue = await IssueModel.getById(req.params.id);
    if (req.user.id !== issue.assignee.id) return res.redirect(`/issues/${req.params.id}`);
    next();
  }
}
