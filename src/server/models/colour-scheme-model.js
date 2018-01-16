import { IssueState } from '../utils/issue-state';

export class ColourSchemeModel {
  constructor(id, title, resolve, close, inProgress, awaitingStart, defaultColour) {
    this.id = id;
    this.title = title;
    this.resolve = resolve;
    this.close = close;
    this.inProgress = inProgress;
    this.awaitingStart = awaitingStart;
    this.defaultColour = defaultColour;
  }

  static createFromReq({title, resolve, close, inProgress, awaitingStart, defaultColour}) {
    return new ColourSchemeModel(-1, title, resolve, close, inProgress, awaitingStart, defaultColour);
  }

  static createFromDb(colourSchemeData) {
    return new ColourSchemeModel(
      colourSchemeData.SCHEME_ID,
      colourSchemeData.NAME,
      colourSchemeData.RESOLVE_COLOUR,
      colourSchemeData.CLOSE_COLOUR,
      colourSchemeData.IN_PROGRESS_COLOUR,
      colourSchemeData.AWAITING_START_COLOUR,
      colourSchemeData.DEFAULT_COLOUR
    );
  }

  static async insert(db, colourScheme) {
    if (!(colourScheme instanceof ColourSchemeModel)) throw new Error('Data must be of type ColourSchemeModel');
    let sql = 'INSERT INTO colour_schemes VALUES (NULL, ?, ?, ?, ?, ?, ?)';
    let inserts = [
      colourScheme.title,
      colourScheme.resolve,
      colourScheme.close,
      colourScheme.inProgress,
      colourScheme.awaitingStart,
      colourScheme.defaultColour
    ];
    
    sql = db.format(sql, inserts);

    return await db.query(sql);
  }

  static async getById(db, id) {
    let query = db.format(
      'SELECT * FROM colour_schemes WHERE SCHEME_ID=?',
      [id]
    );
    let results = await db.query(query);
    return this.createFromDb(results[0]);
  }

  static async getAll(db) {
    let results = await db.query('SELECT * FROM colour_schemes');
    return results.map(this.createFromDb);
  }

  static async getByEmpId(db, id) {
    let query = db.format('SELECT ' +
      'colour_schemes.RESOLVE_COLOUR, ' +
      'colour_schemes.CLOSE_COLOUR, ' +
      'colour_schemes.IN_PROGRESS_COLOUR, ' +
      'colour_schemes.AWAITING_START_COLOUR, ' +
      'colour_schemes.DEFAULT_COLOUR ' +
      'FROM colour_schemes ' +
        'INNER JOIN teams ON colour_schemes.SCHEME_ID = teams.SCHEME_ID ' +
        'INNER JOIN users ON teams.TEAM_ID = users.TEAM_ID ' +
      'WHERE users.EMP_ID=?', [id]);

    let results = await db.query(query);

    if (!results.length) {
      console.error('No colour schemes found for this team');
      return {};
    }

    let object = {};
    object[IssueState.AWAITING_START] = results[0].AWAITING_START_COLOUR;
    object[IssueState.IN_PROGRESS] = results[0].IN_PROGRESS_COLOUR;
    object[IssueState.RESOLVED] = results[0].RESOLVE_COLOUR;
    object[IssueState.CLOSED] = results[0].CLOSE_COLOUR;
    object['Default'] = results[0].DEFAULT_COLOUR;

    return object;
  }
}
