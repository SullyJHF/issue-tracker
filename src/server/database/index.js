import mysql from 'promise-mysql';
import config from '../config';

class DB {
  constructor() {
    this.pool = mysql.createPool(config.db);
  }

  static create() {
    return new DB();
  }

  async query(sql) {
    try {
      let result = await this.pool.query(sql);
      return result;
    } catch(err) {
      console.error(err);
      return err;
    }
  }

  format(query, inserts) {
    return mysql.format(query, inserts);
  }
}

export default DB.create();
