import { TokenModel } from './token-model';
import { TeamModel } from './team-model';
import { TierModel } from './tier-model';
import db from '../database';
import bcrypt from 'bcrypt';

export class UserModel {
  constructor(id, email, hashedPass, firstName, surname, capacity, team, tier, role) {
    this.id = id;
    this.email = email;
    this.hashedPass = hashedPass;
    this.firstName = firstName;
    this.surname = surname;
    this.fullName = `${this.firstName} ${this.surname}`;
    this.capacity = capacity;
    this.team = team;
    this.tier = tier;
    this.role = role;
  }

  static async createFromReq({email, password, firstName, surname, capacity, team, tier, role}) {
    // team and tier are both ids
    let id = -1;
    let teamObj = await TeamModel.getById(team);
    let tierObj = await TierModel.getByName(tier);
    // bcrypt.hash automatically makes salt
    let hashedPass = await bcrypt.hash(password, 10);
    return new UserModel(id, email, hashedPass, firstName, surname, capacity, teamObj, tierObj, role || 0);
  }

  static async createFromDb(userData) {
    let team = await TeamModel.getById(userData.TEAM_ID);
    let tier = await TierModel.getByName(userData.TIER);
    return new UserModel(
      userData.EMP_ID,
      userData.EMAIL,
      userData.HASHED_PASS,
      userData.FIRST_NAME,
      userData.SURNAME,
      userData.CAPACITY,
      team,
      tier,
      userData.ROLE
    );
  }

  static async insert(user) {
    if (!(user instanceof UserModel)) throw new Error('Data must be of type UserModel');
    // this has null in it for the ROLE for now, to set everyone to the default value of 0
    let sql = 'INSERT INTO users VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)';
    let inserts = [
      user.email,
      user.hashedPass,
      user.firstName,
      user.surname,
      user.capacity,
      user.role,
      user.team.id,
      user.tier.name
    ];
    
    sql = db.format(sql, inserts);
    let result = await db.query(sql);
    user.id = result.insertId;

    return result;
  }

  static async update(userData) {
    let sql = db.format(
      'UPDATE users SET ' +
        'EMAIL = ?, ' +
        'FIRST_NAME = ?, ' +
        'SURNAME = ?, ' +
        'CAPACITY = ?, ' +
        'TEAM_ID = ?, ' +
        'TIER = ?, ' +
        'ROLE = ? ' +
      'WHERE users.EMP_ID = ?',
      [
        userData.email,
        userData.firstName,
        userData.surname,
        userData.capacity,
        userData.team,
        userData.tier,
        userData.role,
        userData.id
      ]
    );

    return await db.query(sql);
  }

  // Either returns { formData, errors, error }
  // in the case of an error
  // or a user object if there are no errors
  static async validate(email, password) {
    let formData = { email };
    let errors = {};

    let user = await UserModel.getByEmail(email);
    
    if (!user) {
      errors.error = true;
      errors.email = 'Email not found';
      errors.statusCode = 404;
    } else {
      // check if password matches
      let passwordMatch = await bcrypt.compare(password, user.hashedPass);

      if (!passwordMatch) {
        errors.error = true;
        errors.password = 'Password incorrect';
        errors.statusCode = 401
      }
    }


    if (email === '') {
      errors.error = true;
      errors.email = 'Please provide an email';
      errors.statusCode = 400;
    }

    if (password === '') {
      errors.error = true;
      errors.password = 'Please provide a password';
      errors.statusCode = 400;
    }

    if (errors.error) return { formData, errors, error: errors.error };

    return user;
  }


  static async getAll() {
    let results = await db.query('SELECT * FROM users');
    return Promise.all(results.map(UserModel.createFromDb));
  }

  static async getByEmail(email) {
    let query = 'SELECT * FROM users WHERE EMAIL = ?';
    let inserts = [email];
    query = db.format(query, inserts);
    let results = await db.query(query);
    if (results.length) {
      return await UserModel.createFromDb(results[0]);
    }
    return null;
  }

  static async getById(id) {
    let query = 'SELECT * FROM users WHERE EMP_ID = ?';
    let inserts = [id];
    query = db.format(query, inserts);
    let results = await db.query(query);
    if (results.length) {
      return await UserModel.createFromDb(results[0]);
    }
    return null;
  }

  static async getByTeamId(id) {
    let query = 'SELECT * FROM users WHERE TEAM_ID = ?';
    let inserts = [id];
    query = db.format(query, inserts);
    let results = await db.query(query);
    if (results.length) {
      return Promise.all(results.map(UserModel.createFromDb));
    }
    return [];
  }
}
