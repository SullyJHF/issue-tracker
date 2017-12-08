import { IssueState } from '../utils/issue-state';
import db from '../database';
import parse from 'parse-duration';

export class IssueModel {
  constructor(id, title, description, estimate, assigneeId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.estimate = estimate;
    this.assigneeId = assigneeId; // create user from this id for the model

    this.state = IssueState.OPEN;
    this.totalHours = 0;
  }

  static async createFromReq({project, title, description, estimate, assigneeId}) {
    let id = await IssueModel.getIdForProject(project.toUpperCase());
    return new IssueModel(id, title, description, IssueModel.convertEstimate(estimate), assigneeId);
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
      issue.assigneeId
    ];

    sql = db.format(sql, inserts);

    return await db.query(sql);
  }

  static convertEstimate(estimateString) {
    let estimate = parse(estimateString);
    return estimate / 1000 / 60 / 60;
  }

  static async getIdForProject(project) {
    let sql = db.format('SELECT * FROM issues WHERE left(ISSUE_ID, ?) = ?', [project.length + 1, project + '-']);
    let results = await db.query(sql);

    if (!results.length) return `${project}-1`;

    return `${project}-${results.length + 1}`;
  }
}
