import db from '../database';
import moment from 'moment';

export class SprintModel {
  constructor(start, length, id) {
    this.start = start;
    this.friendlyStart = moment(this.start * 1000).format('DD/MM/YYYY');
    this.length = length;
    this.end = +moment(this.start * 1000).clone().add(this.length, 'days') / 1000;
    this.friendlyEnd = moment(this.end * 1000).format('DD/MM/YYYY');
    this.id = id;
  }

  static createFromReq({start, length}) {
    return new SprintModel(Date.parse(start) / 1000, length, -1);
  }

  static createFromDb(sprintData) {
    return new SprintModel(
      sprintData.SPRINT_START,
      sprintData.SPRINT_LENGTH,
      sprintData.SPRINT_ID
    );
  }

  static async insert(sprint) {
    if (!(sprint instanceof SprintModel)) throw new Error('Data must be of type SprintModel');
    let sql = 'INSERT INTO sprints VALUES (NULL, ?, ?)';
    let inserts = [
      sprint.start,
      sprint.length
    ];
    
    sql = db.format(sql, inserts);

    return await db.query(sql);
  }

  static async getById(id) {
    let query = db.format(
      'SELECT * FROM sprints WHERE SPRINT_ID=?',
      [id]
    );
    let results = await db.query(query);
    return this.createFromDb(results[0]);
  }

  static async getAll() {
    let results = await db.query('SELECT * FROM sprints');
    return results.map(this.createFromDb);
  }
}
