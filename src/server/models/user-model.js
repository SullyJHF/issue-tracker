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
  }

  static async createFromReq({email, password, firstName, surname, capacity, team, tier}) {
    // team and tier are both ids
    let id = -1;
    let teamObj = await TeamModel.getById(team);
    let tierObj = await TierModel.getByName(tier);
    // bcrypt.hash automatically makes salt
    let hashedPass = await bcrypt.hash(password, 10);
    return new UserModel(id, email, hashedPass, firstName, surname, capacity, teamObj, tierObj);
  }

  static createFromDb(userData) {
    return new UserModel(
      userData.EMP_ID,
      userData.EMAIL,
      userData.HASHED_PASS,
      userData.FIRST_NAME,
      userData.SURNAME,
      userData.CAPACITY,
      userData.TEAM_ID,
      userData.TIER
    );
  }

  static async insert(user) {
    if (!(user instanceof UserModel)) throw new Error('Data must be of type UserModel');
    let sql = 'INSERT INTO users VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)';
    let inserts = [
      user.email,
      user.hashedPass,
      user.firstName,
      user.surname,
      user.capacity,
      user.team.id,
      user.tier.name
    ];
    
    sql = db.format(sql, inserts);
    let result = await db.query(sql);
    user.id = result.insertId;

    return result;
  }

  static async validate(email, password) {
    // formData will be passed back to the ejs
    // and will repopulate the relevant data
    let formData = { email };
    let errors = {};
    // check if email exists
    let user = await UserModel.getByEmail(email);
    if (!user) {
      errors.email = 'Email not found';
      errors.statusCode = 404;
      return { formData, errors, error: true };
    }

    // check if password matches
    let passwordMatch = await bcrypt.compare(password, user.hashedPass);
    if (!passwordMatch) {
      errors.password = 'Password incorrect';
      errors.statusCode = 401
      return { formData, errors, error: true };
    }
    // return relevant errors
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
}
