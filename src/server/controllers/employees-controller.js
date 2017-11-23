import { ColourSchemeModel } from '../models/colour-scheme-model';
import { TeamModel } from '../models/team-model';

export class EmployeesController {
  constructor() {

  }

  async index(req, res) {
    let colourSchemes = await ColourSchemeModel.getAll();
    let teams = await TeamModel.getAll();
    res.render('employees', { css: ['main.css'], title: 'Employees', colourSchemes, teams });
  }

  async createTeam(req, res) {
    let team = TeamModel.createFromReq(req.body);
    let result = await TeamModel.insert(team);
    res.redirect('/employees');
  }
}
