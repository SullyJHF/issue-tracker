import { ColourSchemeModel } from '../models/colour-scheme-model';
import { TeamModel } from '../models/team-model';
import { TierModel } from '../models/tier-model';
import { UserModel } from '../models/user-model';

export class EmployeesController {
  constructor() {

  }

  async index(req, res) {
    let colourSchemes = await ColourSchemeModel.getAll();
    let teams = await TeamModel.getAll();
    let tiers = await TierModel.getAll();
    let formData = req.body.formData || req.session.prevBody || {};
    res.render('employees', { css: ['main.css'], title: 'Employees', colourSchemes, teams, tiers, formData });
    req.session.destroy();
  }

  async create(req, res) {
    console.log(req.body);
    let user = await UserModel.createFromReq(req.body);
    let result = await UserModel.insert(user);
    res.redirect('/employees');
  }

  async createTeam(req, res) {
    let team = await TeamModel.createFromReq(req.body);
    let result = await TeamModel.insert(team);
    res.redirect('/employees');
  }

  async createTier(req, res) {
    let tier = TierModel.createFromReq(req.body);
    let result = await TierModel.insert(tier);
    res.redirect('/employees');
  }
}
