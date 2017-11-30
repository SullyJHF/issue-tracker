import { TokenModel } from './token-model';
import { TeamModel } from './team-model';
import { TierModel } from './tier-model';
import db from '../database';
import bcrypt from 'bcrypt';

export class UserModel {
  constructor(id, email, hashedPass, firstName, surname, capacity, team, tier, token) {
    this.id = id;
    this.email = email;
    this.hashedPass = hashedPass;
    this.firstName = firstName;
    this.surname = surname;
    this.capacity = capacity;
    this.team = team;
    this.tier = tier;
    this.token = token;
  }

  static async createFromReq({email, password, firstName, surname, capacity, team, tier}) {
    // team and tier are both ids
    // need to create model for token
    let id = -1;
    let teamObj = await TeamModel.getById(team);
    let tierObj = await TierModel.getByName(tier);
    let token = await TokenModel.generateBlankToken();
    // bcrypt.hash automatically makes salt
    let hashedPass = await bcrypt.hash(password, 10);
    return new UserModel(id, email, hashedPass, firstName, surname, capacity, teamObj, tierObj, token);
  }

  static createFromDb(userData) {
    return new UserModel(
      userData.EMP_ID,
      userData.EMAIL,
      userData.HASHED_PASS,
      userData.FIRST_NAME,
      userData.SURNAME,
      userData.CAPACITY,
      // Make these last three an actual model object of each id
      userData.TEAM_ID,
      userData.TIER,
      userData.TOKEN_ID
    );
  }

  static async insert(user) {
    if (!(user instanceof UserModel)) throw new Error('Data must be of type UserModel');
    let sql = 'INSERT INTO users VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)';
    let inserts = [
      user.email,
      user.hashedPass,
      user.firstName,
      user.surname,
      user.capacity,
      user.team.id,
      user.tier.name,
      user.token.id
    ];
    
    sql = db.format(sql, inserts);
    let result = await db.query(sql);
    user.id = result.insertId;

    return result;
  }

  static async getAll() {
    let results = await db.query('SELECT * FROM users');
    return results.map(this.createFromDb);
  }

  static async getByEmail(email) {
    let query = 'SELECT * FROM users WHERE EMAIL = ?';
    let inserts = [email];
    query = db.format(query, inserts);
    let results = await db.query(query);
    if (results.length) {
      return UserModel.createFromDb(results[0]);
    }
    return null;
  }

  static async checkExists(email) {
    let user = await UserModel.getByEmail(email);
    if (user) return true;
    return false;
  }
}
