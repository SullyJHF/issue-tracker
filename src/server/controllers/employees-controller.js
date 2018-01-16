import { ColourSchemeModel } from '../models/colour-scheme-model';
import { TeamModel } from '../models/team-model';
import { TierModel } from '../models/tier-model';
import { UserModel } from '../models/user-model';

export class EmployeesController {
  constructor(db) {
    this.db = db;
    this.index = this.index.bind(this);
    this.singleIndex = this.singleIndex.bind(this);
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.createTeam = this.createTeam.bind(this);
    this.createTier = this.createTier.bind(this);
    this.checkUser = this.checkUser.bind(this);
  }

  async index(req, res) {
    let colourSchemes = await ColourSchemeModel.getAll(this.db);
    let teams = await TeamModel.getAll(this.db);
    let tiers = await TierModel.getAll(this.db);
    let users = await UserModel.getAll(this.db);
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
    let user = await UserModel.getById(this.db, req.user.id);
    res.render('employee', { css: ['main.css'], title: 'Employees', user });
  }

  async create(req, res) {
    console.log(req.body);
    let user = await UserModel.createFromReq(this.db, req.body);
    let result = await UserModel.insert(this.db, user);
    res.redirect('/employees');
  }

  async edit(req, res) {
    let result = await UserModel.update(this.db, req.body);
    res.redirect('/employees');
  }

  async createTeam(req, res) {
    let team = await TeamModel.createFromReq(this.db, req.body);
    let result = await TeamModel.insert(this.db, team);
    res.redirect('/employees');
  }

  async createTier(req, res) {
    let tier = TierModel.createFromReq(req.body);
    let result = await TierModel.insert(this.db, tier);
    res.redirect('/employees');
  }

  async checkUser(req, res, next) {
    if (req.user.role > 0) return next();

    await this.singleIndex(req, res);
  }
}
