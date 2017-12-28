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
    let user = users.find((u) => u.id === req.user.id);

    let employeeMap = teams.reduce((map, team) => {
      map[team.id] = users.filter((user) => user.team.id === team.id);
      return map;
    }, {});

    let formData = req.body.formData || req.session.prevBody || {};

    res.render('employees', { css: ['main.css'], title: 'Employees', colourSchemes, teams, tiers, employeeMap, formData, user });
    req.session.destroy();
  }

  async singleIndex(req, res) {
    let user = await UserModel.getById(req.user.id);
    res.render('employee', { css: ['main.css'], title: 'Employees', user });
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

  async checkUser(req, res, next) {
    if (req.user.role > 0) return next();

    await this.singleIndex(req, res);
  }
}
