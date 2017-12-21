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
    let users = await UserModel.getAll();

    let employeeMap = teams.reduce((map, team) => {
      map[team.id] = users.filter((user) => user.team.id === team.id);
      return map;
    }, {});

    let formData = req.body.formData || req.session.prevBody || {};

    res.render('employees', { css: ['main.css'], title: 'Employees', colourSchemes, teams, tiers, employeeMap, formData });
    req.session.destroy();
  }

  async create(req, res) {
    console.log(req.body);
    let user = await UserModel.createFromReq(req.body);
    let result = await UserModel.insert(user);
    res.redirect('/employees');
  }

  async edit(req, res) {
    let result = await UserModel.update(req.body);
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
