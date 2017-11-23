import { ColourSchemeModel } from '../models/colour-scheme-model';
import { TeamModel } from '../models/team-model';
import { TierModel } from '../models/tier-model';

export class EmployeesController {
  constructor() {

  }

  async index(req, res) {
    let colourSchemes = await ColourSchemeModel.getAll();
    let teams = await TeamModel.getAll();
    let tiers = await TierModel.getAll();
    res.render('employees', { css: ['main.css'], title: 'Employees', colourSchemes, teams, tiers });
  }

  async createTeam(req, res) {
    let team = TeamModel.createFromReq(req.body);
    let result = await TeamModel.insert(team);
    res.redirect('/employees');
  }

  async createTier(req, res) {
    let tier = TierModel.createFromReq(req.body);
    let result = await TierModel.insert(tier);
    res.redirect('/employees');
  }
}
