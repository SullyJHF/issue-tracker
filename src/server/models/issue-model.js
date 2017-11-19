import { IssueState } from '../utils/issue-state';
import db from '../database';

export class IssueModel {
  constructor(project, title, description, estimate, assigneeId) {
    this.id = project;
    this.title = title;
    this.description = description;
    this.estimate = this.convertEstimate(estimate);
    this.assigneeId = assigneeId; // create user from this id for the model

    this.state = IssueState.OPEN;
    this.totalHours = 0;
  }

  static create({project, title, description, estimate, assigneeId}) {
    return new IssueModel(project, title, description, estimate, assigneeId);
  }


  convertEstimate(estimateString) {
    return 5.0;
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
}
