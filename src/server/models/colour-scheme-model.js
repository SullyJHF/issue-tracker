import db from '../database';

export class ColourSchemeModel {
  constructor(title, resolve, close, inProgress, awaitingStart, defaultColour) {
    this.title = title;
    this.resolve = resolve;
    this.close = close;
    this.inProgress = inProgress;
    this.awaitingStart = awaitingStart;
    this.defaultColour = defaultColour;
  }

  static create({title, resolve, close, inProgress, awaitingStart, defaultColour}) {
    return new ColourSchemeModel(title, resolve, close, inProgress, awaitingStart, defaultColour);
  }

  static async insertColourScheme(colourScheme) {
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
}
