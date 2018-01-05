import { ColourSchemeModel } from '../models/colour-scheme-model';
import { UserModel } from '../models/user-model';
import { TeamModel } from '../models/team-model';

export class DataController {
  constructor() {}

  async index(req, res) {
    let colourSchemes = await ColourSchemeModel.getAll();
    let colours = await ColourSchemeModel.getByEmpId(req.user.id);
    let formData = req.body.formData || req.session.prevBody || {};
    res.render('data', { css: ['main.css'], colourSchemes, formData, colours });
    req.session.destroy();
  }

  async dataOnlyIndex(req, res) {
    let user = await UserModel.getById(req.user.id);
    let colours = await ColourSchemeModel.getByEmpId(user.id);
    let estimatedData = await TeamModel.getEstimatedChartData(user.team.id);
    let timeLoggedData = await TeamModel.getTimeLoggedChartData(user.team.id);
    let team = user.team;
    // get all employees in current user's team
    res.render('data-only', { css: ['main.css'], colours, estimatedData, timeLoggedData, team });
  }

  async createColourScheme(req, res) {
    let colourScheme = ColourSchemeModel.createFromReq(req.body);
    let result = await ColourSchemeModel.insert(colourScheme);
    res.redirect('/data');
  }

  async checkRole(req, res, next) {
    if (req.user.role > 0) return next();

    await this.dataOnlyIndex(req, res);
  }
}
