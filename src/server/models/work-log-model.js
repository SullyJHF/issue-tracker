import db from '../database';

import { SprintModel } from './sprint-model';
import { IssueModel } from './issue-model';

export class WorkLogModel {
  constructor(sprint, issue, time) {
    this.sprint = sprint;
    this.issue = issue;
    this.time = time;
  }

  static create(sprint, issue, time) {
    return new WorkLogModel(sprint, issue, time);
  }

  static async createFromDb(workLogData) {
    let sprint = await SprintModel.getById(workLogData.SPRINT_ID);
    let issue = await IssueModel.getById(workLogData.ISSUE_ID);
    return new WorkLogModel(
      sprint,
      issue,
      workLogData.SECONDS_LOGGED
    );
  }

  static async insert(workLog) {
    if (!(workLog instanceof WorkLogModel)) throw new Error('Data must be of type WorkLogModel');
    let sql = 'INSERT INTO work_log VALUES (?, ?, ?)';
    let inserts = [
      workLog.sprint.id,
      workLog.issue.id,
      workLog.time
    ];
    
    sql = db.format(sql, inserts);

    return await db.query(sql);
  }

  static async getByUser(user) {
    return [];
  }

  static async getBySprintAndIssue(sprint, issue) {
    return [];
  }

  static async getBySprint(issue) {
    return [];
  }

  static async getByIssue(issue) {
    return [];
  }

  static async getAll() {
    let results = await db.query('SELECT * FROM work_log');
    return results.map(this.createFromDb);
  }
}
