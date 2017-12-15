import { SprintModel } from '../models/sprint-model';

export class SprintController {
  constructor() {}

  async index(req, res) {
    let sprints = await SprintModel.getAll();

    res.render('sprint', { css: ['main.css'], sprints });
  }

  async create(req, res) {
    let sprint = await SprintModel.createFromReq(req.body);
    // validate here
    let result = await SprintModel.insert(sprint);

    res.redirect('/sprint');
  }
}
