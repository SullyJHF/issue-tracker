import { ColourSchemeModel } from '../models/colour-scheme-model';

export class DataController {
  constructor() {

  }

  async index(req, res) {
    let colourSchemes = await ColourSchemeModel.getAll();
    let formData = req.body.formData || req.session.prevBody || {};
    res.render('data', { css: ['main.css'], colourSchemes, formData });
  }

  async createColourScheme(req, res) {
    let colourScheme = ColourSchemeModel.createFromReq(req.body);
    let result = await ColourSchemeModel.insert(colourScheme);
    res.redirect('/data');
  }
}
