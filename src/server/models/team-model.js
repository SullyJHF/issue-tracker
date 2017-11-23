import { ColourSchemeModel } from './colour-scheme-model';
import db from '../database';

export class TeamModel {
  constructor(id, name, colourScheme) {
    this.id = id;
    this.name = name;
    this.colourScheme = colourScheme;
  }

  // change colourScheme to colourSchemeId
  static async createFromReq({name, colourScheme}) {
    let colourSchemeObj = await ColourSchemeModel.getById(colourScheme);
    return new TeamModel(-1, name, colourSchemeObj);
  }

  static createFromDb(teamData) {
    return new TeamModel(
      teamData.TEAM_ID,
      teamData.TEAM_NAME,
      ColourSchemeModel.createFromDb(teamData)
    );
  }

  static async insert(team) {
    if (!(team instanceof TeamModel)) throw new Error('Data must be of type TeamModel');
    let sql = 'INSERT INTO teams VALUES (NULL, ?, ?)';
    let inserts = [
      team.name,
      team.colourScheme.id
    ];
    
    sql = db.format(sql, inserts);

    let result = await db.query(sql);

    // if there're no errors do this
    team.id = result.insertId;

    return result;
  }

  static async getAll() {
    let results = await db.query('SELECT * FROM teams, colour_schemes WHERE teams.SCHEME_ID = colour_schemes.SCHEME_ID');
    return results.map(this.createFromDb);
  }
}
