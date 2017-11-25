import db from '../database';

export class TokenModel {
  constructor(id, access, refresh, accessExpiry, refreshExpiry) {
    this.id = id;
    this.access = access;
    this.refresh = refresh;
    this.accessExpiry = accessExpiry;
    this.refreshExpiry = refreshExpiry;
  }

  static createFromReq({access, refresh, accessExpiry, refreshExpiry}) {
    let id = -1;
    return new TokenModel(id, access, refresh, accessExpiry, refreshExpiry);
  }

  static createFromDb(tokenData) {
    return new TokenModel(
      tokenData.TOKEN_ID,
      tokenData.ACCESS_TOKEN,
      tokenData.REFRESH_TOKEN,
      tokenData.ACCESS_EXPIRY,
      tokenData.REFRESH_EXPIRY
    );
  }

  static async insert(token) {
    if (!(token instanceof TokenModel)) throw new Error('Data must be of type TokenModel');
    let sql = 'INSERT INTO tokens VALUES (NULL, ?, ?, ?, ?)';
    let inserts = [
      token.access,
      token.refresh,
      token.accessExpiry,
      token.refreshExpiry
    ];
    
    sql = db.format(sql, inserts);
    let result = await db.query(sql);
    token.id = result.insertId;

    // if result is ok return the token
    return token;
  }

  static async getAll() {
    let results = await db.query('SELECT * FROM tokens');
    return results.map(this.createFromDb);
  }

  static async generateBlankToken() {
    let token = new TokenModel(-1, '', '', new Date(), new Date());
    let insertedToken = await this.insert(token);
    return insertedToken;
  }
}
