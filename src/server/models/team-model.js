import db from '../database';

export class TeamModel {
  constructor(id, name, colourScheme) {
    this.id = id;
    this.name = name;
    this.colourScheme = colourScheme;
  }

  static createFromReq({name, colourScheme}) {
    return new TeamModel(-1, name, colourScheme);
  }

  static createFromDb(teamData) {
    return new TeamModel(
      teamData.TEAM_ID,
      teamData.TEAM_NAME,
      teamData.SCHEME_ID
    );
  }

  static async insert(team) {
    if (!(team instanceof TeamModel)) throw new Error('Data must be of type TeamModel');
    let sql = 'INSERT INTO teams VALUES (NULL, ?, ?)';
    let inserts = [
      team.name,
      team.colourScheme
    ];
    
    sql = db.format(sql, inserts);

    return await db.query(sql);
  }

  static async getAll() {
    let results = await db.query('SELECT * FROM teams');
    return results.map(this.createFromDb);
  }
}
