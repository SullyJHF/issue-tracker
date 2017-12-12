import { IssueState } from '../utils/issue-state';
import { UserModel } from './user-model';
import db from '../database';
import parse from 'parse-duration';
import humanizer from '../utils/humanizer';

export class IssueModel {
  constructor(id, title, description, estimate, assignee, state, totalHours) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.estimate = estimate;
    this.friendlyEstimate = humanizer(estimate * 60 * 60 * 1000);
    this.assignee = assignee;

    this.state = state;
    this.totalHours = totalHours;
    this.friendlyTotal = humanizer(totalHours * 60 * 60 * 1000);
  }

  static async createFromReq({project, title, description, estimate, assigneeId}) {
    let id = await IssueModel.getIdForProject(project.toUpperCase());
    let assignee = await UserModel.getById(assigneeId);
    return new IssueModel(id, title, description, IssueModel.convertEstimate(estimate), assignee, IssueState.OPEN, 0);
  }

  static async createFromDb(dbIssue) {
    let assignee = await UserModel.getById(dbIssue.EMP_ID);
    return new IssueModel(
      dbIssue.ISSUE_ID,
      dbIssue.TITLE,
      dbIssue.DESCRIPTION,
      dbIssue.ESTIMATED_TIME,
      assignee,
      dbIssue.STATE,
      dbIssue.TOTAL_HOURS_LOGGED
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
      issue.totalHours,
      issue.estimate,
      issue.assignee.id
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

  static async getIdForProject(project) {
    let sql = db.format('SELECT * FROM issues WHERE left(ISSUE_ID, ?) = ?', [project.length + 1, project + '-']);
    let results = await db.query(sql);

    if (!results.length) return `${project}-1`;

    return `${project}-${results.length + 1}`;
  }

  static convertEstimate(estimateString) {
    let estimate = parse(estimateString);
    return estimate / 1000 / 60 / 60;
  }
}
