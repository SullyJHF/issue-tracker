import { ColourSchemeModel } from '../models/colour-scheme-model';

export class DataController {
  constructor() {

  }

  async index(req, res) {
    let colourSchemes = await ColourSchemeModel.getAll();
    res.render('data', { css: ['main.css'], colourSchemes });
  }

  async createColourScheme(req, res) {
    let colourScheme = ColourSchemeModel.createFromReq(req.body);
    let result = ColourSchemeModel.insert(colourScheme);
    res.redirect('/data');
  }
}
