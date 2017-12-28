import { SprintModel } from '../models/sprint-model';

export class SprintController {
  constructor() {}

  async index(req, res) {
    let sprints = await SprintModel.getAll();
    let currentSprint = await SprintModel.getCurrentSprint();
    let formData = req.body.formData || req.session.prevBody || {};

    res.render('sprint', { css: ['main.css'], sprints, formData, currentSprint });
    req.session.destroy();
  }

  async create(req, res) {
    let sprint = await SprintModel.createFromReq(req.body);
    // validate here
    // Check if new sprint overlaps any others
    let result = await SprintModel.insert(sprint);

    res.redirect('/sprint');
  }

  async checkRole(req, res, next) {
    if (req.user.role > 0) return next();

    await this.index(req, res);
  }
}
