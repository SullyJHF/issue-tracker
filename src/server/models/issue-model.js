import { IssueState } from '../utils/issue-state';
import { UserModel } from './user-model';
import { SprintModel } from './sprint-model';
import { WorkLogModel } from './work-log-model';
import db from '../database';
import { convertTime } from '../utils';
import humanizer from '../utils/humanizer';

export class IssueModel {
  constructor(id, title, description, estimate, assignee, state, totalSeconds, workLogs) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.estimate = estimate;
    this.friendlyEstimate = humanizer(estimate * 1000);
    this.assignee = assignee;

    this.state = state;
    this.totalSeconds = Math.max(totalSeconds, 0);
    this.friendlyTotal = humanizer(this.totalSeconds * 1000);

    this.workLogs = workLogs;
  }

  static async createFromReq({project, title, description, estimate, assigneeId}) {
    let id = await IssueModel.getIdForProject(project.toUpperCase());
    let assignee = await UserModel.getById(assigneeId);
    let workLogs = await WorkLogModel.getByIssueId(id);
    return new IssueModel(id, title, description, convertTime(estimate), assignee, IssueState.AWAITING_START, 0, workLogs);
  }

  static async createFromDb(dbIssue) {
    let assignee = await UserModel.getById(dbIssue.EMP_ID);
    let workLogs = await WorkLogModel.getByIssueId(dbIssue.ISSUE_ID);
    return new IssueModel(
      dbIssue.ISSUE_ID,
      dbIssue.TITLE,
      dbIssue.DESCRIPTION,
      dbIssue.ESTIMATED_TIME,
      assignee,
      dbIssue.STATE,
      dbIssue.TOTAL_SECONDS_LOGGED,
      workLogs
    );
  }


  static async insertIssue(issue) {
    if (!(issue instanceof IssueModel)) throw new Error('Data must be of type IssueModel');
    let sql = 'INSERT INTO issues VALUES (?, ?, ?, ?, ?, ?, ?)';
    let inserts = [
      issue.id,
      issue.title,
      issue.description,
      issue.state,
      Math.max(issue.totalSeconds, 0),
      issue.estimate,
      issue.assignee.id
    ];

    sql = db.format(sql, inserts);

    return Object.assign(await db.query(sql), {id: issue.id});
  }

  static async updateIssue(issue) {
    if (!(issue instanceof IssueModel)) throw new Error('Data must be of type IssueModel');
    let sql = 'UPDATE issues SET TITLE=?, DESCRIPTION=?, STATE=?, TOTAL_SECONDS_LOGGED=?, ESTIMATED_TIME=?, EMP_ID=? WHERE ISSUE_ID=?';
    let inserts = [
      issue.title,
      issue.description,
      issue.state,
      Math.max(issue.totalSeconds, 0),
      issue.estimate,
      issue.assignee.id,
      issue.id
    ];

    sql = db.format(sql, inserts);

    return Object.assign(await db.query(sql), {id: issue.id});
  }

  static async getAll() {
    let results = await db.query('SELECT * FROM issues');
    return Promise.all(results.map(IssueModel.createFromDb));
  }

  static async getById(id) {
    let query = 'SELECT * FROM issues WHERE ISSUE_ID = ?';
    let inserts = [id];
    query = db.format(query, inserts);
    let results = await db.query(query);
    if (results.length) {
      return await IssueModel.createFromDb(results[0]);
    }
    return null;
  }

  static async getByTeamId(id) {
    let query = db.format('SELECT * FROM issues JOIN users ON issues.EMP_ID = users.EMP_ID WHERE TEAM_ID = ?', [id]);
    let results = await db.query(query);
    if (results.length) {
      return Promise.all(results.map(IssueModel.createFromDb));
    }
    return null;
  }

  static async getIdForProject(project) {
    let sql = db.format('SELECT * FROM issues WHERE left(ISSUE_ID, ?) = ?', [project.length + 1, project + '-']);
    let results = await db.query(sql);

    if (!results.length) return `${project}-1`;

    return `${project}-${results.length + 1}`;
  }

  static async logTime(issue, timeStr) {
    let time = convertTime(timeStr);
    let sprint = await SprintModel.getCurrentSprint();
    let workLog = WorkLogModel.create(sprint.id, issue.id, time);

    if (workLog === null) {
      // return some errors
    }

    let result = await WorkLogModel.insert(workLog);

    issue.totalSeconds += time;

    return await IssueModel.updateIssue(issue);
  }

  static async removeWorkLog(issueId, sprintId, time) {
    let issue = await IssueModel.getById(issueId);
    let sql = db.format('DELETE FROM work_log WHERE ISSUE_ID = ? AND SPRINT_ID = ? AND SECONDS_LOGGED = ?', [issueId, sprintId, time]);

    let result = await db.query(sql);
    // if result is ok
    issue.totalSeconds -= time;

    return await IssueModel.updateIssue(issue);
  }

  static async editWorkLog(issueId, sprintId, time, oldTime) {
    time = convertTime(time);
    let issue = await IssueModel.getById(issueId);
    let sql = db.format(
      'UPDATE work_log SET SECONDS_LOGGED = ? WHERE ISSUE_ID = ? AND SPRINT_ID = ? AND SECONDS_LOGGED = ?',
      [time, issueId, sprintId, oldTime]
    );

    let result = await db.query(sql);
    // if result is ok
    issue.totalSeconds -= (oldTime - time);

    return await IssueModel.updateIssue(issue);
  }

  static async deleteIssue(id) {
    let query = db.format('DELETE FROM issues WHERE ISSUE_ID = ?', [id]);
    let results = await db.query(query);
    return results;
  }
}
