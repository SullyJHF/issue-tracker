import { ColourSchemeModel } from '../models/colour-scheme-model';
import { UserModel } from '../models/user-model';
import { TeamModel } from '../models/team-model';

export class DataController {
  constructor(db) {
    this.db = db;
    this.index = this.index.bind(this);
    this.dataOnlyIndex = this.dataOnlyIndex.bind(this);
    this.createColourScheme = this.createColourScheme.bind(this);
    this.checkRole = this.checkRole.bind(this);
  }

  async index(req, res) {
    let colourSchemes = await ColourSchemeModel.getAll(this.db);
    let colours = await ColourSchemeModel.getByEmpId(this.db, req.user.id);
    let formData = req.body.formData || req.session.prevBody || {};
    let teams = await TeamModel.getAll(this.db);
    let estimatedGraphs = await Promise.all(teams.map(team => TeamModel.getEstimatedChartData(this.db, team.id)));
    let loggedTimeGraphs = await Promise.all(teams.map(team => TeamModel.getTimeLoggedChartData(this.db, team.id)));
    estimatedGraphs = estimatedGraphs.filter(graph => graph !== undefined);
    loggedTimeGraphs = loggedTimeGraphs.filter(graph => graph !== undefined);
    res.render('data', { css: ['main.css'], colourSchemes, formData, colours, teams, estimatedGraphs, loggedTimeGraphs });
    req.session.destroy();
  }

  async dataOnlyIndex(req, res) {
    let user = await UserModel.getById(this.db, req.user.id);
    let colours = await ColourSchemeModel.getByEmpId(this.db, user.id);
    let estimatedData = await TeamModel.getEstimatedChartData(this.db, user.team.id);
    let timeLoggedData = await TeamModel.getTimeLoggedChartData(this.db, user.team.id);
    let team = user.team;
    // get all employees in current user's team
    res.render('data-only', { css: ['main.css'], colours, estimatedData, timeLoggedData, team });
  }

  async createColourScheme(req, res) {
    let colourScheme = ColourSchemeModel.createFromReq(req.body);
    let result = await ColourSchemeModel.insert(this.db, colourScheme);
    res.redirect('/data');
  }

  async checkRole(req, res, next) {
    if (req.user.role > 0) return next();

    await this.dataOnlyIndex(req, res);
  }
}
