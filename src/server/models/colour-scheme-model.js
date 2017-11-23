import db from '../database';

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

  static async insert(colourScheme) {
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

  static async getById(id) {
    let query = db.format(
      'SELECT * FROM colour_schemes WHERE SCHEME_ID=?',
      [id]
    );
    let results = await db.query(query);
    return this.createFromDb(results[0]);
  }

  static async getAll() {
    let results = await db.query('SELECT * FROM colour_schemes');
    return results.map(this.createFromDb);
  }
}
