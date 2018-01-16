import { IssueModel } from '../models/issue-model';
import { UserModel } from '../models/user-model';
import { ColourSchemeModel } from '../models/colour-scheme-model';

import { IssueState } from '../utils/issue-state';

export class IssuesController {
  constructor(db) {
    this.db = db;
    this.index = this.index.bind(this);
    this.issue = this.issue.bind(this);
    this.create = this.create.bind(this);
    this.log = this.log.bind(this);
    this.removeLog = this.removeLog.bind(this);
    this.editLog = this.editLog.bind(this);
    this.resolve = this.resolve.bind(this);
    this.close = this.close.bind(this);
    this.toggleProgress = this.toggleProgress.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.checkUser = this.checkUser.bind(this);
  }

  async index(req, res) {
    let user = await UserModel.getById(this.db, req.user.id);
    let issues;
    if (req.user.role > 0) {
      issues = await IssueModel.getAll(this.db);
    } else {
      issues = await IssueModel.getByTeamId(this.db, user.team.id);
    }
    let colours = await ColourSchemeModel.getByEmpId(this.db, req.user.id);
    let formData = req.body.formData || req.session.prevBody || {};

    res.render('issues', { css: ['main.css'], issues, colours, formData });
    req.session.destroy();
  }

  async issue(req, res) {
    let issue = await IssueModel.getById(this.db, req.params.id);
    if (issue === null) return res.redirect('/issues');
    if (req.user.role < 1) {
      let user = await UserModel.getById(this.db, req.user.id);
      let teamIssues = await IssueModel.getByTeamId(this.db, user.team.id);
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
    let issue = await IssueModel.createFromReq(this.db, req.body);
    let result = await IssueModel.insertIssue(this.db, issue);

    let id = result.id;
    res.redirect(`/issues/${id}`);
  }

  async log(req, res) {
    let issue = await IssueModel.getById(this.db, req.params.id);
    let timeStr = req.body.time;

    let result = await IssueModel.logTime(this.db, issue, timeStr);

    res.redirect(`/issues/${issue.id}`);
  }

  async removeLog(req, res) {
    let issueId = req.params.id;
    let sprintId = req.body.logSprint;
    let time = req.body.logTime;


    let result = await IssueModel.removeWorkLog(this.db, issueId, sprintId, time);
    res.redirect(`/issues/${issueId}`);
  }

  async editLog(req, res) {
    let issueId = req.params.id;
    let sprintId = req.body.editLogSprint;
    let time = req.body.editLogTime;
    let oldTime = req.body.editLogOldTime;

    let result = await IssueModel.editWorkLog(this.db, issueId, sprintId, time, oldTime);

    res.redirect(`/issues/${issueId}`);
  }

  async resolve(req, res) {
    let issue = await IssueModel.getById(this.db, req.params.id);
    issue.state = IssueState.RESOLVED;

    let result = await IssueModel.updateIssue(this.db, issue);

    res.redirect(`/issues/${issue.id}`);
  }

  async close(req, res) {
    let issue = await IssueModel.getById(this.db, req.params.id);
    issue.state = IssueState.CLOSED;

    let result = await IssueModel.updateIssue(this.db, issue);

    res.redirect(`/issues/${issue.id}`);
  }

  async toggleProgress(req, res) {
    let issue = await IssueModel.getById(this.db, req.params.id);

    issue.state = issue.state !== IssueState.IN_PROGRESS ? IssueState.IN_PROGRESS : IssueState.AWAITING_START;

    try {
      issue = await IssueModel.updateIssue(this.db, issue);
    } catch (e) {
      console.error(e);
    }

    res.redirect(`/issues/${req.params.id}`);
  }

  async deleteIssue(req, res) {
    let results = await IssueModel.deleteIssue(this.db, req.params.id);
    res.redirect('/issues');
  }

  async checkUser(req, res, next) {
    if (req.user.role > 0) return next();
    
    let issue = await IssueModel.getById(this.db, req.params.id);
    if (req.user.id !== issue.assignee.id) return res.redirect(`/issues/${req.params.id}`);
    next();
  }
}
