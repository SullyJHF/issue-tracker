import { ColourSchemeModel } from '../models/colour-scheme-model';

export class DataController {
  constructor() {

  }

  index(req, res) {
    res.render('data', { css: ['main.css'] })
  }

  async createColourScheme(req, res) {
    let colourScheme = ColourSchemeModel.create(req.body);
    let result = ColourSchemeModel.insertColourScheme(colourScheme);
    res.redirect('/data');
  }
}
