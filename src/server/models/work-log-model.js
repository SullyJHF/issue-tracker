import { SprintModel } from './sprint-model';
import { IssueModel } from './issue-model';

import humanizer from '../utils/humanizer';

export class WorkLogModel {
  constructor(sprint, issue, time) {
    this.sprint = sprint;
    this.issue = issue;
    this.time = time;
    this.friendlyTime = humanizer(this.time * 1000);
  }

  static create(sprint, issue, time) {
    return new WorkLogModel(sprint, issue, time);
  }

  static createFromDb(workLogData) {
    return new WorkLogModel(
      workLogData.SPRINT_ID,
      workLogData.ISSUE_ID,
      workLogData.SECONDS_LOGGED
    );
  }

  static async insert(db, workLog) {
    if (!(workLog instanceof WorkLogModel)) throw new Error('Data must be of type WorkLogModel');
    let sql = 'INSERT INTO work_log VALUES (?, ?, ?)';
    let inserts = [
      workLog.sprint,
      workLog.issue,
      workLog.time
    ];
    
    sql = db.format(sql, inserts);

    return await db.query(sql);
  }

  static async getByUser(db, user) {
    return [];
  }

  static async getBySprintAndIssue(db, sprint, issue) {
    return [];
  }

  static async getBySprint(db, id) {
    let query = db.format('SELECT * FROM work_log WHERE SPRINT_ID=?', [id]);
    let results = await db.query(query);
    return results.map(this.createFromDb);
  }

  static async getByIssueId(db, id) {
    let query = db.format('SELECT * FROM work_log WHERE ISSUE_ID=?', [id]);
    let results = await db.query(query);
    return results.map(this.createFromDb);
  }

  static async getAll(db) {
    let results = await db.query('SELECT * FROM work_log');
    return results.map(this.createFromDb);
  }
}
