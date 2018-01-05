import db from '../database';

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

  static async createFromDb(workLogData) {
    return new WorkLogModel(
      workLogData.SPRINT_ID,
      workLogData.ISSUE_ID,
      workLogData.SECONDS_LOGGED
    );
  }

  static async insert(workLog) {
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

  static async getByUser(user) {
    return [];
  }

  static async getBySprintAndIssue(sprint, issue) {
    return [];
  }

  static async getBySprint(id) {
    let query = db.format('SELECT * FROM work_log WHERE SPRINT_ID=?', [id]);
    let results = await db.query(query);
    return Promise.all(results.map(this.createFromDb));
  }

  static async getByIssueId(id) {
    let query = db.format('SELECT * FROM work_log WHERE ISSUE_ID=?', [id]);
    let results = await db.query(query);
    return Promise.all(results.map(this.createFromDb));
  }

  static async getAll() {
    let results = await db.query('SELECT * FROM work_log');
    return results.map(this.createFromDb);
  }
}
