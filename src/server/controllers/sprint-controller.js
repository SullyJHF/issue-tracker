export class SprintController {
  constructor() {

  }

  index(req, res) {
    res.render('sprint', { css: ['main.css'] });
  }
}
