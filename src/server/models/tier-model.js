import db from '../database';

export class TierModel {
  constructor(name, cost) {
    this.name = name;
    this.cost = cost;
  }

  static createFromReq({name, cost}) {
    return new TierModel(name, cost);
  }

  static createFromDb(tierData) {
    return new TierModel(
      tierData.TIER,
      tierData.COST
    );
  }

  static async insert(tier) {
    if (!(tier instanceof TierModel)) throw new Error('Data must be of type TierModel');
    let sql = 'INSERT INTO tiers VALUES (?, ?)';
    let inserts = [
      tier.name,
      tier.cost
    ];
    
    sql = db.format(sql, inserts);

    return await db.query(sql);
  }

  static async getByName(name) {
    let query = db.format(
      'SELECT * FROM tiers WHERE TIER=?',
      [name]
    );
    let results = await db.query(query);
    return this.createFromDb(results[0]);
  }

  static async getAll() {
    let results = await db.query('SELECT * FROM tiers');
    return results.map(this.createFromDb);
  }
}
